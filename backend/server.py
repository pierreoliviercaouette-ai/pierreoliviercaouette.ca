from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'poc-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Create the main app
app = FastAPI(title="Pierre-Olivier Caouette - Conseiller Sécurité Financière")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBearer(auto_error=False)

# ==================== MODELS ====================

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    is_admin: bool = False
    referral_code: str = Field(default_factory=lambda: str(uuid.uuid4())[:8].upper())
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    is_admin: bool
    referral_code: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Tool Models
class ToolBase(BaseModel):
    name: str
    slug: str
    description: str
    html_content: str
    tags: List[str] = []
    is_active: bool = True
    requires_auth: bool = False

class ToolCreate(ToolBase):
    pass

class Tool(ToolBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ToolResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    html_content: str
    tags: List[str]
    is_active: bool
    requires_auth: bool = False
    created_at: str

# Tool Result Models
class ToolResultCreate(BaseModel):
    tool_id: str
    result_data: dict
    summary: str

class ToolResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    tool_id: str
    tool_name: str
    result_data: dict
    summary: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ToolResultResponse(BaseModel):
    id: str
    tool_id: str
    tool_name: str
    result_data: dict
    summary: str
    created_at: str

# Referral Models
class ReferralCreate(BaseModel):
    referred_email: EmailStr
    referred_name: str
    referred_phone: Optional[str] = None
    notes: Optional[str] = None

class Referral(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    referrer_id: str
    referrer_code: str
    referred_email: str
    referred_name: str
    referred_phone: Optional[str] = None
    notes: Optional[str] = None
    status: str = "pending"  # pending, qualified, rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    qualified_at: Optional[datetime] = None

class ReferralResponse(BaseModel):
    id: str
    referred_email: str
    referred_name: str
    referred_phone: Optional[str]
    notes: Optional[str]
    status: str
    created_at: str
    qualified_at: Optional[str]

# Quarterly draw configuration
DRAW_CONFIG = {
    "quarterly_draw_value": 750,
    "minimum_points_required": 5,
    "chances_per_point": 1
}

# Points system
POINTS_CONFIG = {
    "referral": 1,      # 1 point per confirmed referral
    "google_review": 1, # 1 point for Google review
    "existing_client": 1 # 1 point for existing client verification
}

GOOGLE_REVIEW_LINK = "https://g.page/r/CewlYHqUvuLyEAI/review"
GOOGLE_MAPS_API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY", "")

# Client testimonials model for displaying on the website
class TestimonialCreate(BaseModel):
    author_name: str
    rating: int = 5  # 1-5 stars
    text: str
    profile_photo_url: Optional[str] = None
    time: str = ""  # e.g., "Il y a 2 mois"

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    author_name: str
    rating: int = 5
    text: str
    profile_photo_url: Optional[str] = None
    time: str = ""
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReferralStats(BaseModel):
    total_referrals: int
    qualified_referrals: int
    pending_referrals: int
    total_points: int
    points_breakdown: dict
    current_tier: Optional[dict]
    next_tier: Optional[dict]
    points_to_next_tier: int
    total_rewards_earned: str
    quarterly_draw: Optional[dict] = None

# Google Review Model
class GoogleReviewCreate(BaseModel):
    screenshot_url: Optional[str] = None  # Optional proof

class GoogleReview(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    status: str = "pending"  # pending, verified, rejected
    screenshot_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    verified_at: Optional[datetime] = None

# Existing Client Verification Model
class ExistingClientCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: str  # Format: YYYY-MM-DD

class ExistingClient(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    first_name: str
    last_name: str
    date_of_birth: str
    status: str = "pending"  # pending, verified, rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    verified_at: Optional[datetime] = None

# Notification Models
class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    message: str
    is_read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    is_read: bool
    created_at: str

# Contact Form
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    referral_code: Optional[str] = None

class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    subject: str
    message: str
    referral_code: Optional[str] = None
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[dict]:
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            return None
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        return user
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

async def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    user = await get_current_user(credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Non autorisé")
    return user

async def require_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    user = await require_auth(credentials)
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Accès administrateur requis")
    return user

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    # Check if email exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
    
    # Create user
    user = User(**user_data.model_dump(exclude={"password"}))
    user_dict = user.model_dump()
    user_dict["password_hash"] = hash_password(user_data.password)
    user_dict["created_at"] = user_dict["created_at"].isoformat()
    
    await db.users.insert_one(user_dict)
    
    token = create_token(user.id)
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            phone=user.phone,
            is_admin=user.is_admin,
            referral_code=user.referral_code,
            created_at=user_dict["created_at"]
        )
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    token = create_token(user["id"])
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            first_name=user["first_name"],
            last_name=user["last_name"],
            phone=user.get("phone"),
            is_admin=user.get("is_admin", False),
            referral_code=user["referral_code"],
            created_at=user["created_at"]
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(require_auth)):
    return UserResponse(
        id=user["id"],
        email=user["email"],
        first_name=user["first_name"],
        last_name=user["last_name"],
        phone=user.get("phone"),
        is_admin=user.get("is_admin", False),
        referral_code=user["referral_code"],
        created_at=user["created_at"]
    )

@api_router.put("/auth/profile")
async def update_profile(
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    phone: Optional[str] = None,
    user: dict = Depends(require_auth)
):
    updates = {}
    if first_name:
        updates["first_name"] = first_name
    if last_name:
        updates["last_name"] = last_name
    if phone is not None:
        updates["phone"] = phone
    
    if updates:
        await db.users.update_one({"id": user["id"]}, {"$set": updates})
    
    updated_user = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    return UserResponse(
        id=updated_user["id"],
        email=updated_user["email"],
        first_name=updated_user["first_name"],
        last_name=updated_user["last_name"],
        phone=updated_user.get("phone"),
        is_admin=updated_user.get("is_admin", False),
        referral_code=updated_user["referral_code"],
        created_at=updated_user["created_at"]
    )

# ==================== TOOLS ROUTES ====================

@api_router.get("/tools", response_model=List[ToolResponse])
async def get_tools(user: Optional[dict] = Depends(get_current_user)):
    query = {} if user and user.get("is_admin") else {"is_active": True}
    tools = await db.tools.find(query, {"_id": 0}).to_list(100)
    return [
        ToolResponse(
            id=t["id"],
            name=t["name"],
            slug=t["slug"],
            description=t["description"],
            html_content=t["html_content"],
            tags=t.get("tags", []),
            is_active=t.get("is_active", True),
            requires_auth=t.get("requires_auth", False),
            created_at=t["created_at"]
        )
        for t in tools
    ]

@api_router.get("/tools/{slug}", response_model=ToolResponse)
async def get_tool(slug: str, user: Optional[dict] = Depends(get_current_user)):
    tool = await db.tools.find_one({"slug": slug, "is_active": True}, {"_id": 0})
    if not tool:
        raise HTTPException(status_code=404, detail="Outil non trouvé")
    return ToolResponse(
        id=tool["id"],
        name=tool["name"],
        slug=tool["slug"],
        description=tool["description"],
        html_content=tool["html_content"],
        tags=tool.get("tags", []),
        is_active=tool.get("is_active", True),
        requires_auth=tool.get("requires_auth", False),
        created_at=tool["created_at"]
    )

@api_router.post("/tools", response_model=ToolResponse)
async def create_tool(tool_data: ToolCreate, user: dict = Depends(require_admin)):
    # Check slug uniqueness
    existing = await db.tools.find_one({"slug": tool_data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Ce slug est déjà utilisé")
    
    tool = Tool(**tool_data.model_dump())
    tool_dict = tool.model_dump()
    tool_dict["created_at"] = tool_dict["created_at"].isoformat()
    
    await db.tools.insert_one(tool_dict)
    
    return ToolResponse(
        id=tool.id,
        name=tool.name,
        slug=tool.slug,
        description=tool.description,
        html_content=tool.html_content,
        tags=tool.tags,
        is_active=tool.is_active,
        requires_auth=tool.requires_auth,
        created_at=tool_dict["created_at"]
    )

@api_router.put("/tools/{tool_id}", response_model=ToolResponse)
async def update_tool(tool_id: str, tool_data: ToolCreate, user: dict = Depends(require_admin)):
    existing = await db.tools.find_one({"id": tool_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Outil non trouvé")
    
    updates = tool_data.model_dump()
    await db.tools.update_one({"id": tool_id}, {"$set": updates})
    
    updated = await db.tools.find_one({"id": tool_id}, {"_id": 0})
    return ToolResponse(
        id=updated["id"],
        name=updated["name"],
        slug=updated["slug"],
        description=updated["description"],
        html_content=updated["html_content"],
        tags=updated.get("tags", []),
        is_active=updated.get("is_active", True),
        requires_auth=updated.get("requires_auth", False),
        created_at=updated["created_at"]
    )

@api_router.delete("/tools/{tool_id}")
async def delete_tool(tool_id: str, user: dict = Depends(require_admin)):
    result = await db.tools.delete_one({"id": tool_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Outil non trouvé")
    return {"message": "Outil supprimé"}

@api_router.patch("/tools/{tool_id}/toggle")
async def toggle_tool(tool_id: str, user: dict = Depends(require_admin)):
    tool = await db.tools.find_one({"id": tool_id}, {"_id": 0})
    if not tool:
        raise HTTPException(status_code=404, detail="Outil non trouvé")
    
    new_status = not tool.get("is_active", True)
    await db.tools.update_one({"id": tool_id}, {"$set": {"is_active": new_status}})
    return {"is_active": new_status}

# ==================== TOOL RESULTS ROUTES ====================

@api_router.post("/tool-results", response_model=ToolResultResponse)
async def save_tool_result(result_data: ToolResultCreate, user: dict = Depends(require_auth)):
    tool = await db.tools.find_one({"id": result_data.tool_id}, {"_id": 0})
    if not tool:
        raise HTTPException(status_code=404, detail="Outil non trouvé")
    
    result = ToolResult(
        user_id=user["id"],
        tool_id=result_data.tool_id,
        tool_name=tool["name"],
        result_data=result_data.result_data,
        summary=result_data.summary
    )
    result_dict = result.model_dump()
    result_dict["created_at"] = result_dict["created_at"].isoformat()
    
    await db.tool_results.insert_one(result_dict)
    
    return ToolResultResponse(
        id=result.id,
        tool_id=result.tool_id,
        tool_name=result.tool_name,
        result_data=result.result_data,
        summary=result.summary,
        created_at=result_dict["created_at"]
    )

@api_router.get("/tool-results", response_model=List[ToolResultResponse])
async def get_my_tool_results(user: dict = Depends(require_auth)):
    results = await db.tool_results.find(
        {"user_id": user["id"]}, 
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return [
        ToolResultResponse(
            id=r["id"],
            tool_id=r["tool_id"],
            tool_name=r["tool_name"],
            result_data=r["result_data"],
            summary=r["summary"],
            created_at=r["created_at"]
        )
        for r in results
    ]

# ==================== REFERRAL ROUTES ====================

@api_router.post("/referrals", response_model=ReferralResponse)
async def create_referral(referral_data: ReferralCreate, user: dict = Depends(require_auth)):
    # Check if this email was already referred by this user
    existing = await db.referrals.find_one({
        "referrer_id": user["id"],
        "referred_email": referral_data.referred_email
    })
    if existing:
        raise HTTPException(status_code=400, detail="Vous avez déjà référé cette personne")
    
    referral = Referral(
        referrer_id=user["id"],
        referrer_code=user["referral_code"],
        **referral_data.model_dump()
    )
    referral_dict = referral.model_dump()
    referral_dict["created_at"] = referral_dict["created_at"].isoformat()
    
    await db.referrals.insert_one(referral_dict)
    
    return ReferralResponse(
        id=referral.id,
        referred_email=referral.referred_email,
        referred_name=referral.referred_name,
        referred_phone=referral.referred_phone,
        notes=referral.notes,
        status=referral.status,
        created_at=referral_dict["created_at"],
        qualified_at=None
    )

@api_router.get("/referrals", response_model=List[ReferralResponse])
async def get_my_referrals(user: dict = Depends(require_auth)):
    referrals = await db.referrals.find(
        {"referrer_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return [
        ReferralResponse(
            id=r["id"],
            referred_email=r["referred_email"],
            referred_name=r["referred_name"],
            referred_phone=r.get("referred_phone"),
            notes=r.get("notes"),
            status=r["status"],
            created_at=r["created_at"],
            qualified_at=r.get("qualified_at")
        )
        for r in referrals
    ]

@api_router.get("/referrals/stats", response_model=ReferralStats)
async def get_referral_stats(user: dict = Depends(require_auth)):
    # Get referrals
    referrals = await db.referrals.find(
        {"referrer_id": user["id"]},
        {"_id": 0}
    ).to_list(1000)
    
    total = len(referrals)
    qualified = len([r for r in referrals if r["status"] == "qualified"])
    pending = len([r for r in referrals if r["status"] == "pending"])
    
    # Get Google reviews
    google_reviews = await db.google_reviews.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).to_list(100)
    verified_reviews = len([r for r in google_reviews if r["status"] == "verified"])
    pending_reviews = len([r for r in google_reviews if r["status"] == "pending"])
    
    # Get existing client verifications
    existing_clients = await db.existing_clients.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).to_list(100)
    verified_clients = len([c for c in existing_clients if c["status"] == "verified"])
    pending_clients = len([c for c in existing_clients if c["status"] == "pending"])
    
    # Calculate total points
    referral_points = qualified * POINTS_CONFIG["referral"]
    review_points = verified_reviews * POINTS_CONFIG["google_review"]
    client_points = verified_clients * POINTS_CONFIG["existing_client"]
    total_points = referral_points + review_points + client_points
    
    points_breakdown = {
        "referrals": {"verified": qualified, "pending": pending, "points": referral_points},
        "google_reviews": {"verified": verified_reviews, "pending": pending_reviews, "points": review_points},
        "existing_clients": {"verified": verified_clients, "pending": pending_clients, "points": client_points}
    }
    
    # Quarterly draw eligibility/chances
    minimum_points = DRAW_CONFIG["minimum_points_required"]
    points_to_eligibility = max(0, minimum_points - total_points)
    is_eligible = total_points >= minimum_points
    chances = total_points * DRAW_CONFIG["chances_per_point"] if is_eligible else 0
    
    return ReferralStats(
        total_referrals=total,
        qualified_referrals=qualified,
        pending_referrals=pending,
        total_points=total_points,
        points_breakdown=points_breakdown,
        current_tier=None,
        next_tier=None,
        points_to_next_tier=points_to_eligibility,
        total_rewards_earned="Admissible au tirage trimestriel" if is_eligible else "Non admissible au tirage",
        quarterly_draw={
            "value": DRAW_CONFIG["quarterly_draw_value"],
            "minimum_points": minimum_points,
            "chances_per_point": DRAW_CONFIG["chances_per_point"],
            "is_eligible": is_eligible,
            "points_to_eligibility": points_to_eligibility,
            "chances": chances
        }
    )

# ==================== GOOGLE REVIEW ROUTES ====================

@api_router.post("/google-reviews")
async def submit_google_review(review_data: GoogleReviewCreate, user: dict = Depends(require_auth)):
    # Check if user already submitted a review
    existing = await db.google_reviews.find_one({"user_id": user["id"]})
    if existing:
        raise HTTPException(status_code=400, detail="Vous avez déjà soumis un avis Google")
    
    review = GoogleReview(
        user_id=user["id"],
        screenshot_url=review_data.screenshot_url
    )
    review_dict = review.model_dump()
    review_dict["created_at"] = review_dict["created_at"].isoformat()
    
    await db.google_reviews.insert_one(review_dict)
    
    return {"message": "Avis soumis! Il sera vérifié sous peu.", "id": review.id, "status": "pending"}

@api_router.get("/google-reviews/me")
async def get_my_google_review(user: dict = Depends(require_auth)):
    review = await db.google_reviews.find_one({"user_id": user["id"]}, {"_id": 0})
    return review

@api_router.get("/google-reviews/link")
async def get_google_review_link():
    return {"link": GOOGLE_REVIEW_LINK}

# Admin: Get all Google reviews
@api_router.get("/admin/google-reviews")
async def get_all_google_reviews(user: dict = Depends(require_admin)):
    reviews = await db.google_reviews.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    result = []
    for r in reviews:
        reviewer = await db.users.find_one({"id": r["user_id"]}, {"_id": 0})
        result.append({
            **r,
            "user_name": f"{reviewer['first_name']} {reviewer['last_name']}" if reviewer else "Inconnu",
            "user_email": reviewer["email"] if reviewer else "Inconnu"
        })
    
    return result

# Admin: Update Google review status
@api_router.patch("/admin/google-reviews/{review_id}/status")
async def update_google_review_status(
    review_id: str,
    status: str,
    user: dict = Depends(require_admin)
):
    if status not in ["pending", "verified", "rejected"]:
        raise HTTPException(status_code=400, detail="Statut invalide")
    
    review = await db.google_reviews.find_one({"id": review_id}, {"_id": 0})
    if not review:
        raise HTTPException(status_code=404, detail="Avis non trouvé")
    
    updates = {"status": status}
    if status == "verified":
        updates["verified_at"] = datetime.now(timezone.utc).isoformat()
        
        # Create notification
        notification = Notification(
            user_id=review["user_id"],
            title="Avis Google vérifié!",
            message=f"Votre avis Google a été vérifié. Vous avez gagné {POINTS_CONFIG['google_review']} points!"
        )
        notif_dict = notification.model_dump()
        notif_dict["created_at"] = notif_dict["created_at"].isoformat()
        await db.notifications.insert_one(notif_dict)
    
    await db.google_reviews.update_one({"id": review_id}, {"$set": updates})
    return {"status": status}

# ==================== EXISTING CLIENT ROUTES ====================

@api_router.post("/existing-clients")
async def submit_existing_client(client_data: ExistingClientCreate, user: dict = Depends(require_auth)):
    # Check if user already submitted
    existing = await db.existing_clients.find_one({"user_id": user["id"]})
    if existing:
        raise HTTPException(status_code=400, detail="Vous avez déjà soumis une vérification de client existant")
    
    client = ExistingClient(
        user_id=user["id"],
        first_name=client_data.first_name,
        last_name=client_data.last_name,
        date_of_birth=client_data.date_of_birth
    )
    client_dict = client.model_dump()
    client_dict["created_at"] = client_dict["created_at"].isoformat()
    
    await db.existing_clients.insert_one(client_dict)
    
    return {"message": "Vérification soumise! Elle sera traitée sous peu.", "id": client.id, "status": "pending"}

@api_router.get("/existing-clients/me")
async def get_my_existing_client(user: dict = Depends(require_auth)):
    client = await db.existing_clients.find_one({"user_id": user["id"]}, {"_id": 0})
    return client

# Admin: Get all existing client verifications
@api_router.get("/admin/existing-clients")
async def get_all_existing_clients(user: dict = Depends(require_admin)):
    clients = await db.existing_clients.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    result = []
    for c in clients:
        submitter = await db.users.find_one({"id": c["user_id"]}, {"_id": 0})
        result.append({
            **c,
            "submitter_name": f"{submitter['first_name']} {submitter['last_name']}" if submitter else "Inconnu",
            "submitter_email": submitter["email"] if submitter else "Inconnu"
        })
    
    return result

# Admin: Update existing client status
@api_router.patch("/admin/existing-clients/{client_id}/status")
async def update_existing_client_status(
    client_id: str,
    status: str,
    user: dict = Depends(require_admin)
):
    if status not in ["pending", "verified", "rejected"]:
        raise HTTPException(status_code=400, detail="Statut invalide")
    
    client = await db.existing_clients.find_one({"id": client_id}, {"_id": 0})
    if not client:
        raise HTTPException(status_code=404, detail="Vérification non trouvée")
    
    updates = {"status": status}
    if status == "verified":
        updates["verified_at"] = datetime.now(timezone.utc).isoformat()
        
        # Create notification
        notification = Notification(
            user_id=client["user_id"],
            title="Client existant vérifié!",
            message=f"Votre statut de client existant a été vérifié. Vous avez gagné {POINTS_CONFIG['existing_client']} points!"
        )
        notif_dict = notification.model_dump()
        notif_dict["created_at"] = notif_dict["created_at"].isoformat()
        await db.notifications.insert_one(notif_dict)
    
    await db.existing_clients.update_one({"id": client_id}, {"$set": updates})
    return {"status": status}

# Admin: Update referral status
@api_router.patch("/admin/referrals/{referral_id}/status")
async def update_referral_status(
    referral_id: str,
    status: str,
    user: dict = Depends(require_admin)
):
    if status not in ["pending", "qualified", "rejected"]:
        raise HTTPException(status_code=400, detail="Statut invalide")
    
    referral = await db.referrals.find_one({"id": referral_id}, {"_id": 0})
    if not referral:
        raise HTTPException(status_code=404, detail="Référence non trouvée")
    
    updates = {"status": status}
    if status == "qualified":
        updates["qualified_at"] = datetime.now(timezone.utc).isoformat()
        
        # Create notification for the referrer
        notification = Notification(
            user_id=referral["referrer_id"],
            title="Référence qualifiée!",
            message=f"Votre référence {referral['referred_name']} a été qualifiée. Merci!"
        )
        notif_dict = notification.model_dump()
        notif_dict["created_at"] = notif_dict["created_at"].isoformat()
        await db.notifications.insert_one(notif_dict)
    
    await db.referrals.update_one({"id": referral_id}, {"$set": updates})
    return {"status": status}

# Admin: Get all referrals
@api_router.get("/admin/referrals")
async def get_all_referrals(user: dict = Depends(require_admin)):
    referrals = await db.referrals.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    # Enrich with referrer info
    result = []
    for r in referrals:
        referrer = await db.users.find_one({"id": r["referrer_id"]}, {"_id": 0})
        result.append({
            **r,
            "referrer_name": f"{referrer['first_name']} {referrer['last_name']}" if referrer else "Inconnu",
            "referrer_email": referrer["email"] if referrer else "Inconnu"
        })
    
    return result

# ==================== NOTIFICATIONS ROUTES ====================

@api_router.get("/notifications", response_model=List[NotificationResponse])
async def get_notifications(user: dict = Depends(require_auth)):
    notifications = await db.notifications.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(50)
    
    return [
        NotificationResponse(
            id=n["id"],
            title=n["title"],
            message=n["message"],
            is_read=n.get("is_read", False),
            created_at=n["created_at"]
        )
        for n in notifications
    ]

@api_router.patch("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, user: dict = Depends(require_auth)):
    result = await db.notifications.update_one(
        {"id": notification_id, "user_id": user["id"]},
        {"$set": {"is_read": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification non trouvée")
    return {"success": True}

@api_router.patch("/notifications/read-all")
async def mark_all_notifications_read(user: dict = Depends(require_auth)):
    await db.notifications.update_many(
        {"user_id": user["id"]},
        {"$set": {"is_read": True}}
    )
    return {"success": True}

# ==================== CONTACT ROUTES ====================

@api_router.post("/contact")
async def submit_contact(form: ContactForm):
    submission = ContactSubmission(**form.model_dump())
    sub_dict = submission.model_dump()
    sub_dict["created_at"] = sub_dict["created_at"].isoformat()
    
    await db.contact_submissions.insert_one(sub_dict)
    
    # If referral code provided, track it
    if form.referral_code:
        referrer = await db.users.find_one({"referral_code": form.referral_code}, {"_id": 0})
        if referrer:
            # Check if this is a new referral from contact form
            existing = await db.referrals.find_one({
                "referrer_code": form.referral_code,
                "referred_email": form.email
            })
            if not existing:
                referral = Referral(
                    referrer_id=referrer["id"],
                    referrer_code=form.referral_code,
                    referred_email=form.email,
                    referred_name=form.name,
                    referred_phone=form.phone,
                    notes=f"Via formulaire de contact: {form.subject}"
                )
                ref_dict = referral.model_dump()
                ref_dict["created_at"] = ref_dict["created_at"].isoformat()
                await db.referrals.insert_one(ref_dict)
    
    return {"message": "Merci! Nous vous contacterons bientôt.", "id": submission.id}

@api_router.get("/admin/contacts")
async def get_contacts(user: dict = Depends(require_admin)):
    contacts = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return contacts

# ==================== ADMIN USERS ====================

@api_router.get("/admin/users")
async def get_all_users(user: dict = Depends(require_admin)):
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    return users

@api_router.patch("/admin/users/{user_id}/admin")
async def toggle_user_admin(user_id: str, user: dict = Depends(require_admin)):
    target = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not target:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    new_status = not target.get("is_admin", False)
    await db.users.update_one({"id": user_id}, {"$set": {"is_admin": new_status}})
    return {"is_admin": new_status}

# ==================== HEALTH CHECK ====================

# ==================== TESTIMONIALS ROUTES ====================

@api_router.get("/testimonials")
async def get_testimonials():
    """Get all active testimonials for public display"""
    testimonials = await db.testimonials.find(
        {"is_active": True},
        {"_id": 0}
    ).sort("created_at", -1).to_list(20)
    return testimonials

@api_router.post("/admin/testimonials")
async def create_testimonial(data: TestimonialCreate, user: dict = Depends(require_admin)):
    """Admin: Create a new testimonial"""
    testimonial = Testimonial(
        author_name=data.author_name,
        rating=data.rating,
        text=data.text,
        profile_photo_url=data.profile_photo_url,
        time=data.time
    )
    testimonial_dict = testimonial.model_dump()
    testimonial_dict["created_at"] = testimonial_dict["created_at"].isoformat()
    
    await db.testimonials.insert_one(testimonial_dict)
    return {"message": "Témoignage créé", "id": testimonial.id}

@api_router.get("/admin/testimonials")
async def get_all_testimonials(user: dict = Depends(require_admin)):
    """Admin: Get all testimonials including inactive ones"""
    testimonials = await db.testimonials.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return testimonials

@api_router.patch("/admin/testimonials/{testimonial_id}")
async def update_testimonial(
    testimonial_id: str,
    data: TestimonialCreate,
    user: dict = Depends(require_admin)
):
    """Admin: Update a testimonial"""
    testimonial = await db.testimonials.find_one({"id": testimonial_id})
    if not testimonial:
        raise HTTPException(status_code=404, detail="Témoignage non trouvé")
    
    updates = {
        "author_name": data.author_name,
        "rating": data.rating,
        "text": data.text,
        "profile_photo_url": data.profile_photo_url,
        "time": data.time
    }
    
    await db.testimonials.update_one({"id": testimonial_id}, {"$set": updates})
    return {"message": "Témoignage mis à jour"}

@api_router.patch("/admin/testimonials/{testimonial_id}/toggle")
async def toggle_testimonial(testimonial_id: str, user: dict = Depends(require_admin)):
    """Admin: Toggle testimonial active status"""
    testimonial = await db.testimonials.find_one({"id": testimonial_id})
    if not testimonial:
        raise HTTPException(status_code=404, detail="Témoignage non trouvé")
    
    new_status = not testimonial.get("is_active", True)
    await db.testimonials.update_one({"id": testimonial_id}, {"$set": {"is_active": new_status}})
    return {"is_active": new_status}

@api_router.delete("/admin/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, user: dict = Depends(require_admin)):
    """Admin: Delete a testimonial"""
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Témoignage non trouvé")
    return {"message": "Témoignage supprimé"}



@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
