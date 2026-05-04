"""
Test suite for the referral program with quarterly draw rules.
Tests the 3 ways to earn points and draw eligibility/chances logic.
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_USER_EMAIL = "admin@test.com"
TEST_USER_PASSWORD = "admin123"

EXPECTED_DRAW_VALUE = 750
EXPECTED_MINIMUM_POINTS = 5

EXPECTED_GOOGLE_REVIEW_LINK = "https://g.page/r/CewlYHqUvuLyEAI/review"


@pytest.fixture(scope="module")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="module")
def auth_token(api_client):
    """Get authentication token for admin user"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": TEST_USER_EMAIL,
        "password": TEST_USER_PASSWORD
    })
    assert response.status_code == 200, f"Login failed: {response.text}"
    return response.json().get("access_token")


@pytest.fixture(scope="module")
def authenticated_client(api_client, auth_token):
    """Session with auth header"""
    api_client.headers.update({"Authorization": f"Bearer {auth_token}"})
    return api_client


class TestHealthCheck:
    """Basic health check tests"""
    
    def test_api_health(self, api_client):
        """Test API health endpoint"""
        response = api_client.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("✓ API health check passed")


class TestGoogleReviewLink:
    """Tests for Google review link endpoint"""
    
    def test_get_google_review_link(self, api_client):
        """Test GET /api/google-reviews/link returns correct link"""
        response = api_client.get(f"{BASE_URL}/api/google-reviews/link")
        assert response.status_code == 200
        data = response.json()
        assert "link" in data
        assert data["link"] == EXPECTED_GOOGLE_REVIEW_LINK
        print(f"✓ Google review link correct: {data['link']}")


class TestReferralStats:
    """Tests for referral stats endpoint with points breakdown"""
    
    def test_get_referral_stats(self, authenticated_client):
        """Test GET /api/referrals/stats returns total_points and points_breakdown"""
        response = authenticated_client.get(f"{BASE_URL}/api/referrals/stats")
        assert response.status_code == 200
        data = response.json()
        
        # Verify required fields exist
        assert "total_points" in data, "Missing total_points field"
        assert "points_breakdown" in data, "Missing points_breakdown field"
        assert "quarterly_draw" in data, "Missing quarterly_draw field"
        assert "points_to_next_tier" in data, "Missing points_to_next_tier field"
        
        # Verify points_breakdown structure
        breakdown = data["points_breakdown"]
        assert "referrals" in breakdown, "Missing referrals in breakdown"
        assert "google_reviews" in breakdown, "Missing google_reviews in breakdown"
        assert "existing_clients" in breakdown, "Missing existing_clients in breakdown"
        
        # Verify each breakdown has verified, pending, points
        for key in ["referrals", "google_reviews", "existing_clients"]:
            assert "verified" in breakdown[key], f"Missing verified in {key}"
            assert "pending" in breakdown[key], f"Missing pending in {key}"
            assert "points" in breakdown[key], f"Missing points in {key}"
        
        print(f"✓ Referral stats returned correctly: {data['total_points']} total points")
        print(f"  - Referrals: {breakdown['referrals']['points']} pts")
        print(f"  - Google reviews: {breakdown['google_reviews']['points']} pts")
        print(f"  - Existing clients: {breakdown['existing_clients']['points']} pts")
    
    def test_points_calculation(self, authenticated_client):
        """Test that total_points equals sum of breakdown points"""
        response = authenticated_client.get(f"{BASE_URL}/api/referrals/stats")
        assert response.status_code == 200
        data = response.json()
        
        breakdown = data["points_breakdown"]
        calculated_total = (
            breakdown["referrals"]["points"] +
            breakdown["google_reviews"]["points"] +
            breakdown["existing_clients"]["points"]
        )
        
        assert data["total_points"] == calculated_total, \
            f"Total points mismatch: {data['total_points']} != {calculated_total}"
        print(f"✓ Points calculation verified: {calculated_total} total")
    
    def test_draw_progression(self, authenticated_client):
        """Test quarterly draw eligibility/chances logic"""
        response = authenticated_client.get(f"{BASE_URL}/api/referrals/stats")
        assert response.status_code == 200
        data = response.json()
        
        total_points = data["total_points"]
        draw = data["quarterly_draw"]
        assert draw["value"] == EXPECTED_DRAW_VALUE
        assert draw["minimum_points"] == EXPECTED_MINIMUM_POINTS
        assert draw["chances_per_point"] == 1

        expected_to_eligibility = max(0, EXPECTED_MINIMUM_POINTS - total_points)
        assert draw["points_to_eligibility"] == expected_to_eligibility
        assert data["points_to_next_tier"] == expected_to_eligibility

        expected_eligible = total_points >= EXPECTED_MINIMUM_POINTS
        assert draw["is_eligible"] == expected_eligible

        expected_chances = total_points if expected_eligible else 0
        assert draw["chances"] == expected_chances
        print(f"✓ Draw progression correct: eligible={expected_eligible}, chances={expected_chances}")


class TestGoogleReviewSubmission:
    """Tests for Google review submission"""
    
    def test_get_my_google_review(self, authenticated_client):
        """Test GET /api/google-reviews/me returns user's review status"""
        response = authenticated_client.get(f"{BASE_URL}/api/google-reviews/me")
        assert response.status_code == 200
        data = response.json()
        
        if data:  # User has submitted a review
            assert "status" in data
            assert data["status"] in ["pending", "verified", "rejected"]
            print(f"✓ Google review status: {data['status']}")
        else:
            print("✓ No Google review submitted yet")
    
    def test_submit_google_review_duplicate(self, authenticated_client):
        """Test that duplicate Google review submission is rejected"""
        # First check if user already has a review
        check_response = authenticated_client.get(f"{BASE_URL}/api/google-reviews/me")
        if check_response.json():
            # User already has a review, try to submit another
            response = authenticated_client.post(f"{BASE_URL}/api/google-reviews", json={})
            assert response.status_code == 400
            assert "déjà soumis" in response.json().get("detail", "").lower()
            print("✓ Duplicate Google review correctly rejected")
        else:
            pytest.skip("User has no existing review to test duplicate rejection")


class TestExistingClientVerification:
    """Tests for existing client verification"""
    
    def test_get_my_existing_client(self, authenticated_client):
        """Test GET /api/existing-clients/me returns user's verification status"""
        response = authenticated_client.get(f"{BASE_URL}/api/existing-clients/me")
        assert response.status_code == 200
        data = response.json()
        
        if data:  # User has submitted verification
            assert "status" in data
            assert data["status"] in ["pending", "verified", "rejected"]
            assert "first_name" in data
            assert "last_name" in data
            assert "date_of_birth" in data
            print(f"✓ Existing client status: {data['status']}")
        else:
            print("✓ No existing client verification submitted yet")
    
    def test_submit_existing_client_duplicate(self, authenticated_client):
        """Test that duplicate existing client submission is rejected"""
        # First check if user already has a verification
        check_response = authenticated_client.get(f"{BASE_URL}/api/existing-clients/me")
        if check_response.json():
            # User already has verification, try to submit another
            response = authenticated_client.post(f"{BASE_URL}/api/existing-clients", json={
                "first_name": "Test",
                "last_name": "User",
                "date_of_birth": "1990-01-01"
            })
            assert response.status_code == 400
            assert "déjà soumis" in response.json().get("detail", "").lower()
            print("✓ Duplicate existing client verification correctly rejected")
        else:
            pytest.skip("User has no existing verification to test duplicate rejection")


class TestNewUserFlow:
    """Tests for new user registration and point earning flow"""
    
    def test_register_new_user_and_submit_google_review(self, api_client):
        """Test new user can register and submit Google review"""
        unique_id = str(uuid.uuid4())[:8]
        test_email = f"test_referral_{unique_id}@test.com"
        
        # Register new user
        register_response = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "email": test_email,
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "Referral"
        })
        assert register_response.status_code == 200
        token = register_response.json()["access_token"]
        
        # Submit Google review
        headers = {"Authorization": f"Bearer {token}"}
        review_response = api_client.post(
            f"{BASE_URL}/api/google-reviews",
            json={},
            headers=headers
        )
        assert review_response.status_code == 200
        data = review_response.json()
        assert data["status"] == "pending"
        print(f"✓ New user {test_email} submitted Google review successfully")
    
    def test_register_new_user_and_submit_existing_client(self, api_client):
        """Test new user can register and submit existing client verification"""
        unique_id = str(uuid.uuid4())[:8]
        test_email = f"test_client_{unique_id}@test.com"
        
        # Register new user
        register_response = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "email": test_email,
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "Client"
        })
        assert register_response.status_code == 200
        token = register_response.json()["access_token"]
        
        # Submit existing client verification
        headers = {"Authorization": f"Bearer {token}"}
        client_response = api_client.post(
            f"{BASE_URL}/api/existing-clients",
            json={
                "first_name": "Test",
                "last_name": "Client",
                "date_of_birth": "1985-06-15"
            },
            headers=headers
        )
        assert client_response.status_code == 200
        data = client_response.json()
        assert data["status"] == "pending"
        print(f"✓ New user {test_email} submitted existing client verification successfully")


class TestReferralCreation:
    """Tests for referral creation"""
    
    def test_create_referral(self, authenticated_client):
        """Test creating a new referral"""
        unique_id = str(uuid.uuid4())[:8]
        
        response = authenticated_client.post(f"{BASE_URL}/api/referrals", json={
            "referred_email": f"referred_{unique_id}@test.com",
            "referred_name": f"Test Referred {unique_id}",
            "referred_phone": "514-555-1234",
            "notes": "Test referral for points system"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "pending"
        assert data["referred_name"] == f"Test Referred {unique_id}"
        print(f"✓ Referral created successfully: {data['referred_name']}")
    
    def test_get_my_referrals(self, authenticated_client):
        """Test getting user's referrals list"""
        response = authenticated_client.get(f"{BASE_URL}/api/referrals")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} referrals")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
