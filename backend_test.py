#!/usr/bin/env python3

import requests
import sys
import json
import uuid
from datetime import datetime

class PIERREOLIVIERAPITester:
    def __init__(self, base_url="https://secure-wealth-tools.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.admin_token = None
        self.user_id = None
        self.admin_user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.created_resources = {
            'tools': [],
            'referrals': [],
            'contacts': [],
            'users': []
        }

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_type=None, description=""):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        # Add authentication if needed
        if auth_type == 'user' and self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        elif auth_type == 'admin' and self.admin_token:
            headers['Authorization'] = f'Bearer {self.admin_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        if description:
            print(f"   Description: {description}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=30)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                except:
                    response_data = {}
            else:
                print(f"❌ FAILED - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error details: {error_data}")
                    response_data = error_data
                except:
                    response_data = {"error": "Could not parse response"}

            self.test_results.append({
                "name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_data": response_data,
                "description": description
            })

            return success, response_data

        except Exception as e:
            print(f"❌ FAILED - Network Error: {str(e)}")
            self.test_results.append({
                "name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": "ERROR",
                "success": False,
                "error": str(e),
                "description": description
            })
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "health",
            200,
            description="Verify API is running and accessible"
        )
        return success

    def test_user_registration(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        user_data = {
            "first_name": "Test",
            "last_name": f"User{timestamp}",
            "email": f"testuser{timestamp}@example.com",
            "phone": "514-123-4567",
            "password": "TestPassword123!"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=user_data,
            description="Create new user account"
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            self.created_resources['users'].append(response['user'])
            print(f"   ✅ Got token: {self.token[:20]}...")
            print(f"   ✅ User ID: {self.user_id}")
        
        return success

    def test_user_login(self):
        """Test user login with existing credentials"""
        if not self.created_resources['users']:
            return False
            
        user = self.created_resources['users'][0]
        login_data = {
            "email": user['email'],
            "password": "TestPassword123!"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data,
            description="Login with existing user credentials"
        )
        
        if success and 'access_token' in response:
            print(f"   ✅ Login successful for: {user['email']}")
        
        return success

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        login_data = {
            "email": "nonexistent@example.com",
            "password": "WrongPassword"
        }
        
        success, response = self.run_test(
            "Invalid Login",
            "POST",
            "auth/login",
            401,
            data=login_data,
            description="Should fail with invalid credentials"
        )
        
        return success

    def test_get_current_user(self):
        """Test getting current user profile"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200,
            auth_type='user',
            description="Get authenticated user's profile"
        )
        
        if success:
            print(f"   ✅ User profile: {response.get('first_name')} {response.get('last_name')}")
        
        return success

    def test_update_profile(self):
        """Test updating user profile"""
        update_data = {
            "phone": "438-987-6543"
        }
        
        success, response = self.run_test(
            "Update Profile",
            "PUT",
            "auth/profile",
            200,
            data=update_data,
            auth_type='user',
            description="Update user profile information"
        )
        
        return success

    def test_get_tools_without_auth(self):
        """Test getting tools without authentication"""
        success, response = self.run_test(
            "Get Tools (No Auth)",
            "GET",
            "tools",
            200,
            description="Should show only active tools to unauthenticated users"
        )
        
        if success:
            print(f"   ✅ Found {len(response)} public tools")
        
        return success

    def test_get_tools_with_auth(self):
        """Test getting tools with authentication"""
        success, response = self.run_test(
            "Get Tools (Auth)",
            "GET",
            "tools",
            200,
            auth_type='user',
            description="Should show tools to authenticated users"
        )
        
        if success:
            print(f"   ✅ Found {len(response)} tools for authenticated user")
        
        return success

    def test_create_referral(self):
        """Test creating a referral"""
        timestamp = datetime.now().strftime('%H%M%S')
        referral_data = {
            "referred_name": f"Referred User {timestamp}",
            "referred_email": f"referred{timestamp}@example.com",
            "referred_phone": "514-555-0123",
            "notes": "Test referral from API testing"
        }
        
        success, response = self.run_test(
            "Create Referral",
            "POST",
            "referrals",
            200,
            data=referral_data,
            auth_type='user',
            description="Create new referral"
        )
        
        if success:
            self.created_resources['referrals'].append(response)
            print(f"   ✅ Referral created: {response.get('referred_name')}")
        
        return success

    def test_get_user_referrals(self):
        """Test getting user's referrals"""
        success, response = self.run_test(
            "Get User Referrals",
            "GET",
            "referrals",
            200,
            auth_type='user',
            description="Get list of user's referrals"
        )
        
        if success:
            print(f"   ✅ Found {len(response)} referrals")
        
        return success

    def test_get_referral_stats(self):
        """Test getting referral statistics"""
        success, response = self.run_test(
            "Get Referral Stats",
            "GET",
            "referrals/stats",
            200,
            auth_type='user',
            description="Get user's referral statistics and tier info"
        )
        
        if success:
            stats = response
            print(f"   ✅ Total referrals: {stats.get('total_referrals', 0)}")
            print(f"   ✅ Qualified: {stats.get('qualified_referrals', 0)}")
            if stats.get('current_tier'):
                print(f"   ✅ Current tier: {stats['current_tier']['name']}")
        
        return success

    def test_contact_form(self):
        """Test contact form submission"""
        timestamp = datetime.now().strftime('%H%M%S')
        contact_data = {
            "name": f"Contact Test {timestamp}",
            "email": f"contact{timestamp}@example.com",
            "phone": "514-123-9999",
            "subject": "Test Contact Form",
            "message": "This is a test message from the API testing suite."
        }
        
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "contact",
            200,
            data=contact_data,
            description="Submit contact form without authentication"
        )
        
        if success:
            self.created_resources['contacts'].append(response)
            print(f"   ✅ Contact form submitted: {response.get('id')}")
        
        return success

    def test_get_notifications(self):
        """Test getting notifications"""
        success, response = self.run_test(
            "Get Notifications",
            "GET",
            "notifications",
            200,
            auth_type='user',
            description="Get user notifications"
        )
        
        if success:
            print(f"   ✅ Found {len(response)} notifications")
        
        return success

    def test_unauthorized_admin_access(self):
        """Test that regular users can't access admin endpoints"""
        success, response = self.run_test(
            "Unauthorized Admin Access",
            "GET",
            "admin/users",
            403,
            auth_type='user',
            description="Regular user should be denied admin access"
        )
        
        return success

    def create_admin_user(self):
        """Create an admin user for testing admin endpoints"""
        timestamp = datetime.now().strftime('%H%M%S')
        admin_data = {
            "first_name": "Admin",
            "last_name": f"User{timestamp}",
            "email": f"admin{timestamp}@example.com",
            "password": "AdminPassword123!"
        }
        
        success, response = self.run_test(
            "Create Admin User",
            "POST",
            "auth/register",
            200,
            data=admin_data,
            description="Create user account that will be made admin"
        )
        
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            self.admin_user_id = response['user']['id']
            print(f"   ✅ Admin user created: {admin_data['email']}")
            return True
        
        return False

    def test_tool_creation_admin(self):
        """Test creating a tool as admin (will fail until user is made admin)"""
        tool_data = {
            "name": "Test Calculator",
            "slug": "test-calculator",
            "description": "A test calculation tool",
            "html_content": "<h2>Test Tool</h2><p>This is a test tool</p>",
            "tags": ["test", "calculator"],
            "is_active": True
        }
        
        success, response = self.run_test(
            "Create Tool (Admin Required)",
            "POST",
            "tools",
            403,  # Should fail for non-admin
            data=tool_data,
            auth_type='admin',
            description="Should fail - user not admin yet"
        )
        
        return success

    def print_summary(self):
        """Print test summary"""
        print(f"\n{'='*60}")
        print(f"📊 TEST SUMMARY")
        print(f"{'='*60}")
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        print(f"\n🔧 CREATED RESOURCES:")
        for resource_type, resources in self.created_resources.items():
            if resources:
                print(f"- {resource_type.title()}: {len(resources)}")
        
        print(f"\n❌ FAILED TESTS:")
        failed_tests = [test for test in self.test_results if not test['success']]
        if not failed_tests:
            print("✅ All tests passed!")
        else:
            for test in failed_tests:
                print(f"- {test['name']}: Expected {test['expected_status']}, got {test['actual_status']}")
                if 'error' in test:
                    print(f"  Error: {test['error']}")

        return self.tests_passed == self.tests_run

def main():
    print("🚀 Starting Pierre-Olivier Caouette API Tests")
    print("=" * 60)
    
    tester = PIERREOLIVIERAPITester()
    
    # Core API tests
    tester.test_health_check()
    
    # Authentication tests
    tester.test_user_registration()
    tester.test_user_login()
    tester.test_invalid_login()
    
    # User profile tests
    if tester.token:
        tester.test_get_current_user()
        tester.test_update_profile()
        
        # Tools tests
        tester.test_get_tools_with_auth()
        
        # Referrals tests
        tester.test_create_referral()
        tester.test_get_user_referrals()
        tester.test_get_referral_stats()
        
        # Notifications
        tester.test_get_notifications()
        
        # Admin access tests
        tester.test_unauthorized_admin_access()
    
    # Public endpoints
    tester.test_get_tools_without_auth()
    tester.test_contact_form()
    
    # Admin user creation
    tester.create_admin_user()
    tester.test_tool_creation_admin()
    
    # Print final summary
    all_passed = tester.print_summary()
    
    # Save detailed results
    try:
        with open('/app/test_reports/backend_test_results.json', 'w') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'summary': {
                    'total_tests': tester.tests_run,
                    'passed': tester.tests_passed,
                    'failed': tester.tests_run - tester.tests_passed,
                    'success_rate': (tester.tests_passed/tester.tests_run*100) if tester.tests_run > 0 else 0
                },
                'detailed_results': tester.test_results,
                'created_resources': tester.created_resources
            }, f, indent=2)
    except Exception as e:
        print(f"Warning: Could not save test results: {e}")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())