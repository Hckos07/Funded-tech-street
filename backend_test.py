#!/usr/bin/env python3
"""
FundedTechStreet Backend API Test Suite
Tests all endpoints: Auth, Public, Trader, Admin, RBAC
"""

import requests
import json
import random
import string
from datetime import datetime

# Configuration
BASE_URL = "https://fundedtech-app.preview.emergentagent.com/api"
DEMO_TRADER_EMAIL = "demo@fundedtechstreet.com"
DEMO_TRADER_PASSWORD = "Demo@12345"
ADMIN_EMAIL = "admin@fundedtechstreet.com"
ADMIN_PASSWORD = "Admin@12345"

# Test results tracking
test_results = {
    "passed": [],
    "failed": [],
    "warnings": []
}

def log_pass(test_name):
    print(f"✅ PASS: {test_name}")
    test_results["passed"].append(test_name)

def log_fail(test_name, reason):
    print(f"❌ FAIL: {test_name}")
    print(f"   Reason: {reason}")
    test_results["failed"].append({"test": test_name, "reason": reason})

def log_warning(test_name, message):
    print(f"⚠️  WARNING: {test_name}")
    print(f"   Message: {message}")
    test_results["warnings"].append({"test": test_name, "message": message})

def random_email():
    """Generate random email for registration"""
    rand = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test_{rand}@fundedtechstreet.com"

def check_no_objectid(data, test_name):
    """Check that response doesn't contain MongoDB ObjectId"""
    json_str = json.dumps(data)
    if '_id' in json_str:
        log_warning(test_name, "Response contains '_id' field (ObjectId leakage)")
    if 'passwordHash' in json_str:
        log_fail(test_name, "Response contains 'passwordHash' field (security issue)")
        return False
    return True

# ============================================================================
# 1. AUTH TESTS
# ============================================================================

def test_auth():
    print("\n" + "="*70)
    print("1. AUTH TESTS")
    print("="*70)
    
    # Test 1.1: Register new user
    try:
        new_email = random_email()
        payload = {
            "name": "Test User",
            "email": new_email,
            "password": "Test@12345",
            "phone": "+1234567890",
            "country": "United States"
        }
        resp = requests.post(f"{BASE_URL}/auth/register", json=payload, timeout=10)
        
        if resp.status_code == 201:
            data = resp.json()
            if 'token' in data and 'user' in data:
                if data['user'].get('role') == 'TRADER':
                    check_no_objectid(data, "auth/register")
                    log_pass("POST /auth/register - new user registration")
                else:
                    log_fail("POST /auth/register", f"Expected role TRADER, got {data['user'].get('role')}")
            else:
                log_fail("POST /auth/register", "Missing token or user in response")
        else:
            log_fail("POST /auth/register", f"Expected 201, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("POST /auth/register", str(e))
    
    # Test 1.2: Login with demo trader
    try:
        payload = {"email": DEMO_TRADER_EMAIL, "password": DEMO_TRADER_PASSWORD}
        resp = requests.post(f"{BASE_URL}/auth/login", json=payload, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'token' in data and 'user' in data:
                global demo_token, demo_user_id
                demo_token = data['token']
                demo_user_id = data['user'].get('id')
                check_no_objectid(data, "auth/login (demo)")
                log_pass("POST /auth/login - demo trader login")
            else:
                log_fail("POST /auth/login", "Missing token or user in response")
        else:
            log_fail("POST /auth/login", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("POST /auth/login", str(e))
    
    # Test 1.3: Login with wrong password
    try:
        payload = {"email": DEMO_TRADER_EMAIL, "password": "WrongPassword123"}
        resp = requests.post(f"{BASE_URL}/auth/login", json=payload, timeout=10)
        
        if resp.status_code == 401:
            log_pass("POST /auth/login - wrong password returns 401")
        else:
            log_fail("POST /auth/login (wrong password)", f"Expected 401, got {resp.status_code}")
    except Exception as e:
        log_fail("POST /auth/login (wrong password)", str(e))
    
    # Test 1.4: GET /auth/me with token
    try:
        headers = {"Authorization": f"Bearer {demo_token}"}
        resp = requests.get(f"{BASE_URL}/auth/me", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'user' in data:
                check_no_objectid(data, "auth/me")
                log_pass("GET /auth/me - with valid token")
            else:
                log_fail("GET /auth/me", "Missing user in response")
        else:
            log_fail("GET /auth/me", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /auth/me", str(e))
    
    # Test 1.5: GET /auth/me without token
    try:
        resp = requests.get(f"{BASE_URL}/auth/me", timeout=10)
        
        if resp.status_code == 401:
            log_pass("GET /auth/me - without token returns 401")
        else:
            log_fail("GET /auth/me (no token)", f"Expected 401, got {resp.status_code}")
    except Exception as e:
        log_fail("GET /auth/me (no token)", str(e))
    
    # Test 1.6: POST /auth/forgot-password
    try:
        payload = {"email": DEMO_TRADER_EMAIL}
        resp = requests.post(f"{BASE_URL}/auth/forgot-password", json=payload, timeout=10)
        
        if resp.status_code == 200:
            log_pass("POST /auth/forgot-password")
        else:
            log_fail("POST /auth/forgot-password", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("POST /auth/forgot-password", str(e))

# ============================================================================
# 2. PUBLIC TESTS
# ============================================================================

def test_public():
    print("\n" + "="*70)
    print("2. PUBLIC TESTS")
    print("="*70)
    
    # Test 2.1: GET /challenges
    try:
        resp = requests.get(f"{BASE_URL}/challenges", timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'challenges' in data:
                challenges = data['challenges']
                if len(challenges) == 5:
                    # Check sorted by size
                    sizes = [c['accountSize'] for c in challenges]
                    if sizes == sorted(sizes):
                        # Check one is recommended
                        recommended = [c for c in challenges if c.get('recommended')]
                        if len(recommended) == 1:
                            global challenge_10k_id, challenge_100k_id
                            challenge_10k_id = next((c['id'] for c in challenges if c['accountSize'] == 10000), None)
                            challenge_100k_id = next((c['id'] for c in challenges if c['accountSize'] == 100000), None)
                            check_no_objectid(data, "challenges")
                            log_pass("GET /challenges - 5 challenges, sorted, one recommended")
                        else:
                            log_fail("GET /challenges", f"Expected 1 recommended challenge, got {len(recommended)}")
                    else:
                        log_fail("GET /challenges", "Challenges not sorted by accountSize")
                else:
                    log_fail("GET /challenges", f"Expected 5 challenges, got {len(challenges)}")
            else:
                log_fail("GET /challenges", "Missing challenges in response")
        else:
            log_fail("GET /challenges", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /challenges", str(e))
    
    # Test 2.2: GET /challenges/{id}
    try:
        if challenge_10k_id:
            resp = requests.get(f"{BASE_URL}/challenges/{challenge_10k_id}", timeout=10)
            
            if resp.status_code == 200:
                data = resp.json()
                if 'challenge' in data:
                    check_no_objectid(data, "challenges/{id}")
                    log_pass("GET /challenges/{id} - by ID")
                else:
                    log_fail("GET /challenges/{id}", "Missing challenge in response")
            else:
                log_fail("GET /challenges/{id}", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /challenges/{id}", str(e))
    
    # Test 2.3: GET /challenges/{slug}
    try:
        resp = requests.get(f"{BASE_URL}/challenges/10k-challenge", timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'challenge' in data:
                check_no_objectid(data, "challenges/{slug}")
                log_pass("GET /challenges/{slug} - by slug")
            else:
                log_fail("GET /challenges/{slug}", "Missing challenge in response")
        else:
            log_fail("GET /challenges/{slug}", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /challenges/{slug}", str(e))
    
    # Test 2.4: GET /stats/public
    try:
        resp = requests.get(f"{BASE_URL}/stats/public", timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'stats' in data:
                log_pass("GET /stats/public")
            else:
                log_fail("GET /stats/public", "Missing stats in response")
        else:
            log_fail("GET /stats/public", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /stats/public", str(e))

# ============================================================================
# 3. TRADER TESTS
# ============================================================================

def test_trader():
    print("\n" + "="*70)
    print("3. TRADER TESTS (with demo trader token)")
    print("="*70)
    
    headers = {"Authorization": f"Bearer {demo_token}"}
    
    # Test 3.1: GET /accounts
    try:
        resp = requests.get(f"{BASE_URL}/accounts", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'accounts' in data:
                accounts = data['accounts']
                if len(accounts) >= 1:
                    # Check for FTS-100248 account
                    demo_account = next((a for a in accounts if a.get('accountNumber') == 'FTS-100248'), None)
                    if demo_account:
                        global demo_account_id
                        demo_account_id = demo_account['id']
                        balance = demo_account.get('currentBalance')
                        profit_pct = demo_account.get('profitPercentage')
                        if balance == 104280 and profit_pct == 4.28:
                            check_no_objectid(data, "accounts")
                            log_pass("GET /accounts - found FTS-100248 with correct balance and profit%")
                        else:
                            log_warning("GET /accounts", f"FTS-100248 found but balance={balance}, profitPercentage={profit_pct}")
                            log_pass("GET /accounts - account list retrieved")
                    else:
                        log_warning("GET /accounts", "FTS-100248 not found in accounts")
                        log_pass("GET /accounts - account list retrieved")
                else:
                    log_fail("GET /accounts", "Expected at least 1 account")
            else:
                log_fail("GET /accounts", "Missing accounts in response")
        else:
            log_fail("GET /accounts", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /accounts", str(e))
    
    # Test 3.2: GET /accounts/{id}
    try:
        if demo_account_id:
            resp = requests.get(f"{BASE_URL}/accounts/{demo_account_id}", headers=headers, timeout=10)
            
            if resp.status_code == 200:
                data = resp.json()
                if 'account' in data:
                    check_no_objectid(data, "accounts/{id}")
                    log_pass("GET /accounts/{id}")
                else:
                    log_fail("GET /accounts/{id}", "Missing account in response")
            else:
                log_fail("GET /accounts/{id}", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /accounts/{id}", str(e))
    
    # Test 3.3: GET /accounts/{id}/performance?range=ALL
    try:
        if demo_account_id:
            resp = requests.get(f"{BASE_URL}/accounts/{demo_account_id}/performance?range=ALL", headers=headers, timeout=10)
            
            if resp.status_code == 200:
                data = resp.json()
                if 'equity' in data and 'performance' in data and 'monthly' in data and 'daily' in data:
                    equity = data['equity']
                    perf = data['performance']
                    
                    # Check equity points (~90+)
                    if len(equity) >= 90:
                        # Check performance KPIs
                        required_kpis = ['winRate', 'profitFactor', 'averageWin', 'averageLoss', 'totalProfit', 'totalTrades']
                        missing_kpis = [k for k in required_kpis if k not in perf]
                        if not missing_kpis:
                            check_no_objectid(data, "accounts/{id}/performance")
                            log_pass(f"GET /accounts/{{id}}/performance?range=ALL - {len(equity)} equity points, all KPIs present")
                        else:
                            log_fail("GET /accounts/{id}/performance", f"Missing KPIs: {missing_kpis}")
                    else:
                        log_warning("GET /accounts/{id}/performance", f"Expected ~90+ equity points, got {len(equity)}")
                        log_pass("GET /accounts/{id}/performance?range=ALL")
                else:
                    log_fail("GET /accounts/{id}/performance", "Missing equity/performance/monthly/daily in response")
            else:
                log_fail("GET /accounts/{id}/performance", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /accounts/{id}/performance", str(e))
    
    # Test 3.4: GET /accounts/{id}/performance?range=1W
    try:
        if demo_account_id:
            resp = requests.get(f"{BASE_URL}/accounts/{demo_account_id}/performance?range=1W", headers=headers, timeout=10)
            
            if resp.status_code == 200:
                data = resp.json()
                if 'equity' in data:
                    equity = data['equity']
                    if len(equity) <= 7:
                        log_pass("GET /accounts/{id}/performance?range=1W - filtered to 1 week")
                    else:
                        log_warning("GET /accounts/{id}/performance?range=1W", f"Expected <=7 equity points, got {len(equity)}")
                        log_pass("GET /accounts/{id}/performance?range=1W")
                else:
                    log_fail("GET /accounts/{id}/performance?range=1W", "Missing equity in response")
            else:
                log_fail("GET /accounts/{id}/performance?range=1W", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /accounts/{id}/performance?range=1W", str(e))
    
    # Test 3.5: GET /accounts/{id}/performance?range=1M
    try:
        if demo_account_id:
            resp = requests.get(f"{BASE_URL}/accounts/{demo_account_id}/performance?range=1M", headers=headers, timeout=10)
            
            if resp.status_code == 200:
                log_pass("GET /accounts/{id}/performance?range=1M")
            else:
                log_fail("GET /accounts/{id}/performance?range=1M", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /accounts/{id}/performance?range=1M", str(e))
    
    # Test 3.6: GET /accounts/{id}/trades
    try:
        if demo_account_id:
            resp = requests.get(f"{BASE_URL}/accounts/{demo_account_id}/trades", headers=headers, timeout=10)
            
            if resp.status_code == 200:
                data = resp.json()
                if 'trades' in data:
                    trades = data['trades']
                    if len(trades) >= 30:
                        check_no_objectid(data, "accounts/{id}/trades")
                        log_pass(f"GET /accounts/{{id}}/trades - {len(trades)} trades")
                    else:
                        log_warning("GET /accounts/{id}/trades", f"Expected ~34 trades, got {len(trades)}")
                        log_pass("GET /accounts/{id}/trades")
                else:
                    log_fail("GET /accounts/{id}/trades", "Missing trades in response")
            else:
                log_fail("GET /accounts/{id}/trades", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /accounts/{id}/trades", str(e))
    
    # Test 3.7: GET /trades?page=1&limit=10
    try:
        resp = requests.get(f"{BASE_URL}/trades?page=1&limit=10", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'trades' in data and 'total' in data and 'pages' in data:
                trades = data['trades']
                if len(trades) <= 10:
                    check_no_objectid(data, "trades (paginated)")
                    log_pass("GET /trades?page=1&limit=10 - pagination works")
                else:
                    log_fail("GET /trades?page=1&limit=10", f"Expected <=10 trades, got {len(trades)}")
            else:
                log_fail("GET /trades?page=1&limit=10", "Missing trades/total/pages in response")
        else:
            log_fail("GET /trades?page=1&limit=10", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /trades?page=1&limit=10", str(e))
    
    # Test 3.8: GET /trades?side=BUY
    try:
        resp = requests.get(f"{BASE_URL}/trades?side=BUY", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'trades' in data:
                trades = data['trades']
                buy_trades = [t for t in trades if t.get('side') == 'BUY']
                if len(buy_trades) == len(trades):
                    log_pass("GET /trades?side=BUY - filter works")
                else:
                    log_fail("GET /trades?side=BUY", f"Filter failed: {len(buy_trades)}/{len(trades)} are BUY")
            else:
                log_fail("GET /trades?side=BUY", "Missing trades in response")
        else:
            log_fail("GET /trades?side=BUY", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /trades?side=BUY", str(e))
    
    # Test 3.9: GET /trades?status=CLOSED
    try:
        resp = requests.get(f"{BASE_URL}/trades?status=CLOSED", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'trades' in data:
                trades = data['trades']
                closed_trades = [t for t in trades if t.get('status') == 'CLOSED']
                if len(closed_trades) == len(trades):
                    log_pass("GET /trades?status=CLOSED - filter works")
                else:
                    log_fail("GET /trades?status=CLOSED", f"Filter failed: {len(closed_trades)}/{len(trades)} are CLOSED")
            else:
                log_fail("GET /trades?status=CLOSED", "Missing trades in response")
        else:
            log_fail("GET /trades?status=CLOSED", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /trades?status=CLOSED", str(e))
    
    # Test 3.10: GET /payouts
    try:
        resp = requests.get(f"{BASE_URL}/payouts", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'payouts' in data and 'summary' in data:
                summary = data['summary']
                required_fields = ['available', 'total', 'pending', 'paid']
                missing_fields = [f for f in required_fields if f not in summary]
                if not missing_fields:
                    check_no_objectid(data, "payouts")
                    log_pass("GET /payouts - with summary")
                else:
                    log_fail("GET /payouts", f"Missing summary fields: {missing_fields}")
            else:
                log_fail("GET /payouts", "Missing payouts or summary in response")
        else:
            log_fail("GET /payouts", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /payouts", str(e))
    
    # Test 3.11: POST /payouts
    try:
        payload = {
            "amount": 1000,
            "paymentMethod": "Bank Transfer",
            "accountId": demo_account_id
        }
        resp = requests.post(f"{BASE_URL}/payouts", json=payload, headers=headers, timeout=10)
        
        if resp.status_code == 201:
            data = resp.json()
            if 'payout' in data:
                payout = data['payout']
                if payout.get('status') == 'REQUESTED':
                    global new_payout_id
                    new_payout_id = payout.get('id')
                    check_no_objectid(data, "payouts (POST)")
                    log_pass("POST /payouts - created with status REQUESTED")
                else:
                    log_fail("POST /payouts", f"Expected status REQUESTED, got {payout.get('status')}")
            else:
                log_fail("POST /payouts", "Missing payout in response")
        else:
            log_fail("POST /payouts", f"Expected 201, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("POST /payouts", str(e))
    
    # Test 3.12: GET /payouts (verify new payout)
    try:
        resp = requests.get(f"{BASE_URL}/payouts", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'payouts' in data and 'summary' in data:
                payouts = data['payouts']
                new_payout = next((p for p in payouts if p.get('id') == new_payout_id), None)
                if new_payout:
                    summary = data['summary']
                    if summary.get('pending', 0) >= 1000:
                        log_pass("GET /payouts - new payout appears, pending increased")
                    else:
                        log_warning("GET /payouts", f"Pending amount {summary.get('pending')} doesn't reflect new payout")
                        log_pass("GET /payouts - new payout appears")
                else:
                    log_fail("GET /payouts (verify)", "New payout not found in list")
            else:
                log_fail("GET /payouts (verify)", "Missing payouts or summary in response")
        else:
            log_fail("GET /payouts (verify)", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /payouts (verify)", str(e))
    
    # Test 3.13: GET /transactions
    try:
        resp = requests.get(f"{BASE_URL}/transactions", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'transactions' in data:
                check_no_objectid(data, "transactions")
                log_pass("GET /transactions")
            else:
                log_fail("GET /transactions", "Missing transactions in response")
        else:
            log_fail("GET /transactions", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /transactions", str(e))
    
    # Test 3.14: GET /notifications
    try:
        resp = requests.get(f"{BASE_URL}/notifications", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'notifications' in data and 'unread' in data:
                notifications = data['notifications']
                global first_notification_id
                if len(notifications) > 0:
                    first_notification_id = notifications[0].get('id')
                check_no_objectid(data, "notifications")
                log_pass("GET /notifications - with unread count")
            else:
                log_fail("GET /notifications", "Missing notifications or unread in response")
        else:
            log_fail("GET /notifications", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /notifications", str(e))
    
    # Test 3.15: PATCH /notifications/{id}/read
    try:
        if first_notification_id:
            resp = requests.patch(f"{BASE_URL}/notifications/{first_notification_id}/read", headers=headers, timeout=10)
            
            if resp.status_code == 200:
                log_pass("PATCH /notifications/{id}/read")
            else:
                log_fail("PATCH /notifications/{id}/read", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("PATCH /notifications/{id}/read", str(e))
    
    # Test 3.16: PATCH /notifications/read-all
    try:
        resp = requests.patch(f"{BASE_URL}/notifications/read-all", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            # Verify unread count is 0
            resp2 = requests.get(f"{BASE_URL}/notifications", headers=headers, timeout=10)
            if resp2.status_code == 200:
                data = resp2.json()
                if data.get('unread') == 0:
                    log_pass("PATCH /notifications/read-all - unread becomes 0")
                else:
                    log_warning("PATCH /notifications/read-all", f"Unread count is {data.get('unread')}, expected 0")
                    log_pass("PATCH /notifications/read-all")
            else:
                log_pass("PATCH /notifications/read-all")
        else:
            log_fail("PATCH /notifications/read-all", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("PATCH /notifications/read-all", str(e))
    
    # Test 3.17: GET /kyc
    try:
        resp = requests.get(f"{BASE_URL}/kyc", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'kyc' in data:
                kyc = data['kyc']
                if kyc.get('status') == 'VERIFIED':
                    check_no_objectid(data, "kyc")
                    log_pass("GET /kyc - status VERIFIED for demo trader")
                else:
                    log_warning("GET /kyc", f"Expected status VERIFIED, got {kyc.get('status')}")
                    log_pass("GET /kyc")
            else:
                log_fail("GET /kyc", "Missing kyc in response")
        else:
            log_fail("GET /kyc", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /kyc", str(e))
    
    # Test 3.18: POST /kyc
    try:
        payload = {"documentType": "Passport"}
        resp = requests.post(f"{BASE_URL}/kyc", json=payload, headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'kyc' in data:
                kyc = data['kyc']
                if kyc.get('status') == 'VERIFIED':
                    log_pass("POST /kyc - returns VERIFIED")
                else:
                    log_fail("POST /kyc", f"Expected status VERIFIED, got {kyc.get('status')}")
            else:
                log_fail("POST /kyc", "Missing kyc in response")
        else:
            log_fail("POST /kyc", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("POST /kyc", str(e))
    
    # Test 3.19: GET /profile
    try:
        resp = requests.get(f"{BASE_URL}/profile", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'profile' in data:
                check_no_objectid(data, "profile")
                log_pass("GET /profile")
            else:
                log_fail("GET /profile", "Missing profile in response")
        else:
            log_fail("GET /profile", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /profile", str(e))
    
    # Test 3.20: PATCH /profile
    try:
        payload = {"name": "Jordan Blake Updated", "country": "France"}
        resp = requests.patch(f"{BASE_URL}/profile", json=payload, headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'profile' in data:
                profile = data['profile']
                if profile.get('name') == "Jordan Blake Updated" and profile.get('country') == "France":
                    # Restore original name
                    restore_payload = {"name": "Jordan Blake", "country": "United Kingdom"}
                    requests.patch(f"{BASE_URL}/profile", json=restore_payload, headers=headers, timeout=10)
                    log_pass("PATCH /profile - updates applied")
                else:
                    log_fail("PATCH /profile", "Updates not reflected in response")
            else:
                log_fail("PATCH /profile", "Missing profile in response")
        else:
            log_fail("PATCH /profile", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("PATCH /profile", str(e))
    
    # Test 3.21: POST /checkout
    try:
        if challenge_10k_id:
            payload = {"challengeId": challenge_10k_id}
            resp = requests.post(f"{BASE_URL}/checkout", json=payload, headers=headers, timeout=10)
            
            if resp.status_code == 201:
                data = resp.json()
                if 'account' in data and 'transaction' in data:
                    global new_account_id
                    new_account_id = data['account'].get('id')
                    check_no_objectid(data, "checkout")
                    log_pass("POST /checkout - created account + transaction")
                else:
                    log_fail("POST /checkout", "Missing account or transaction in response")
            else:
                log_fail("POST /checkout", f"Expected 201, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("POST /checkout", str(e))
    
    # Test 3.22: GET /accounts (verify new account)
    try:
        resp = requests.get(f"{BASE_URL}/accounts", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'accounts' in data:
                accounts = data['accounts']
                new_account = next((a for a in accounts if a.get('id') == new_account_id), None)
                if new_account:
                    log_pass("GET /accounts - new account from checkout appears")
                else:
                    log_fail("GET /accounts (verify checkout)", "New account not found in list")
            else:
                log_fail("GET /accounts (verify checkout)", "Missing accounts in response")
        else:
            log_fail("GET /accounts (verify checkout)", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /accounts (verify checkout)", str(e))

# ============================================================================
# 4. RBAC TESTS
# ============================================================================

def test_rbac():
    print("\n" + "="*70)
    print("4. RBAC TESTS (trader token on admin routes)")
    print("="*70)
    
    headers = {"Authorization": f"Bearer {demo_token}"}
    
    admin_routes = [
        "admin/stats",
        "admin/users",
        "admin/accounts",
        "admin/challenges",
        "admin/payouts",
        "admin/kyc",
        "admin/trades",
        "admin/transactions",
        "admin/audit-logs"
    ]
    
    for route in admin_routes:
        try:
            resp = requests.get(f"{BASE_URL}/{route}", headers=headers, timeout=10)
            
            if resp.status_code == 403:
                log_pass(f"GET /{route} - trader gets 403")
            else:
                log_fail(f"GET /{route} (RBAC)", f"Expected 403, got {resp.status_code}")
        except Exception as e:
            log_fail(f"GET /{route} (RBAC)", str(e))

# ============================================================================
# 5. ADMIN TESTS
# ============================================================================

def test_admin():
    print("\n" + "="*70)
    print("5. ADMIN TESTS (with admin token)")
    print("="*70)
    
    # Login as admin
    try:
        payload = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        resp = requests.post(f"{BASE_URL}/auth/login", json=payload, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'token' in data:
                global admin_token
                admin_token = data['token']
                log_pass("Admin login successful")
            else:
                log_fail("Admin login", "Missing token in response")
                return
        else:
            log_fail("Admin login", f"Expected 200, got {resp.status_code}: {resp.text}")
            return
    except Exception as e:
        log_fail("Admin login", str(e))
        return
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Test 5.1: GET /admin/stats
    try:
        resp = requests.get(f"{BASE_URL}/admin/stats", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'stats' in data and 'revenue' in data and 'signups' in data:
                check_no_objectid(data, "admin/stats")
                log_pass("GET /admin/stats - with revenue and signups arrays")
            else:
                log_fail("GET /admin/stats", "Missing stats/revenue/signups in response")
        else:
            log_fail("GET /admin/stats", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /admin/stats", str(e))
    
    # Test 5.2: GET /admin/users
    try:
        resp = requests.get(f"{BASE_URL}/admin/users", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'users' in data:
                users = data['users']
                global test_user_id
                test_user_id = users[0].get('id') if len(users) > 0 else None
                check_no_objectid(data, "admin/users")
                log_pass(f"GET /admin/users - {len(users)} users")
            else:
                log_fail("GET /admin/users", "Missing users in response")
        else:
            log_fail("GET /admin/users", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /admin/users", str(e))
    
    # Test 5.3: GET /admin/users?search=demo
    try:
        resp = requests.get(f"{BASE_URL}/admin/users?search=demo", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'users' in data:
                users = data['users']
                demo_user = next((u for u in users if 'demo' in u.get('email', '').lower()), None)
                if demo_user:
                    log_pass("GET /admin/users?search=demo - search works")
                else:
                    log_warning("GET /admin/users?search=demo", "Demo user not found in search results")
                    log_pass("GET /admin/users?search=demo")
            else:
                log_fail("GET /admin/users?search=demo", "Missing users in response")
        else:
            log_fail("GET /admin/users?search=demo", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /admin/users?search=demo", str(e))
    
    # Test 5.4: GET /admin/users?status=ACTIVE
    try:
        resp = requests.get(f"{BASE_URL}/admin/users?status=ACTIVE", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'users' in data:
                users = data['users']
                active_users = [u for u in users if u.get('status') == 'ACTIVE']
                if len(active_users) == len(users):
                    log_pass("GET /admin/users?status=ACTIVE - filter works")
                else:
                    log_fail("GET /admin/users?status=ACTIVE", f"Filter failed: {len(active_users)}/{len(users)} are ACTIVE")
            else:
                log_fail("GET /admin/users?status=ACTIVE", "Missing users in response")
        else:
            log_fail("GET /admin/users?status=ACTIVE", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /admin/users?status=ACTIVE", str(e))
    
    # Test 5.5: GET /admin/users/{id}
    try:
        if test_user_id:
            resp = requests.get(f"{BASE_URL}/admin/users/{test_user_id}", headers=headers, timeout=10)
            
            if resp.status_code == 200:
                data = resp.json()
                if 'user' in data and 'accounts' in data and 'trades' in data:
                    check_no_objectid(data, "admin/users/{id}")
                    log_pass("GET /admin/users/{id} - with accounts and trades")
                else:
                    log_fail("GET /admin/users/{id}", "Missing user/accounts/trades in response")
            else:
                log_fail("GET /admin/users/{id}", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /admin/users/{id}", str(e))
    
    # Test 5.6: PATCH /admin/users/{id}/status (SUSPENDED)
    try:
        if test_user_id:
            payload = {"status": "SUSPENDED"}
            resp = requests.patch(f"{BASE_URL}/admin/users/{test_user_id}/status", json=payload, headers=headers, timeout=10)
            
            if resp.status_code == 200:
                log_pass("PATCH /admin/users/{id}/status - set to SUSPENDED")
            else:
                log_fail("PATCH /admin/users/{id}/status (SUSPENDED)", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("PATCH /admin/users/{id}/status (SUSPENDED)", str(e))
    
    # Test 5.7: PATCH /admin/users/{id}/status (ACTIVE)
    try:
        if test_user_id:
            payload = {"status": "ACTIVE"}
            resp = requests.patch(f"{BASE_URL}/admin/users/{test_user_id}/status", json=payload, headers=headers, timeout=10)
            
            if resp.status_code == 200:
                log_pass("PATCH /admin/users/{id}/status - restored to ACTIVE")
            else:
                log_fail("PATCH /admin/users/{id}/status (ACTIVE)", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("PATCH /admin/users/{id}/status (ACTIVE)", str(e))
    
    # Test 5.8: GET /admin/accounts
    try:
        resp = requests.get(f"{BASE_URL}/admin/accounts", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'accounts' in data:
                accounts = data['accounts']
                if len(accounts) > 0:
                    # Check for ownerName
                    if 'ownerName' in accounts[0]:
                        global test_account_id
                        test_account_id = accounts[0].get('id')
                        check_no_objectid(data, "admin/accounts")
                        log_pass(f"GET /admin/accounts - {len(accounts)} accounts with ownerName")
                    else:
                        log_fail("GET /admin/accounts", "Missing ownerName in accounts")
                else:
                    log_fail("GET /admin/accounts", "No accounts returned")
            else:
                log_fail("GET /admin/accounts", "Missing accounts in response")
        else:
            log_fail("GET /admin/accounts", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /admin/accounts", str(e))
    
    # Test 5.9: GET /admin/accounts?search=FTS
    try:
        resp = requests.get(f"{BASE_URL}/admin/accounts?search=FTS", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'accounts' in data:
                accounts = data['accounts']
                fts_accounts = [a for a in accounts if 'FTS' in a.get('accountNumber', '')]
                if len(fts_accounts) == len(accounts):
                    log_pass("GET /admin/accounts?search=FTS - search works")
                else:
                    log_warning("GET /admin/accounts?search=FTS", f"Search returned {len(accounts)} accounts, {len(fts_accounts)} contain FTS")
                    log_pass("GET /admin/accounts?search=FTS")
            else:
                log_fail("GET /admin/accounts?search=FTS", "Missing accounts in response")
        else:
            log_fail("GET /admin/accounts?search=FTS", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /admin/accounts?search=FTS", str(e))
    
    # Test 5.10: PATCH /admin/accounts/{id}/status
    try:
        if test_account_id:
            payload = {"status": "FUNDED"}
            resp = requests.patch(f"{BASE_URL}/admin/accounts/{test_account_id}/status", json=payload, headers=headers, timeout=10)
            
            if resp.status_code == 200:
                log_pass("PATCH /admin/accounts/{id}/status - set to FUNDED")
            else:
                log_fail("PATCH /admin/accounts/{id}/status", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("PATCH /admin/accounts/{id}/status", str(e))
    
    # Test 5.11: GET /admin/challenges
    try:
        resp = requests.get(f"{BASE_URL}/admin/challenges", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'challenges' in data:
                check_no_objectid(data, "admin/challenges")
                log_pass("GET /admin/challenges")
            else:
                log_fail("GET /admin/challenges", "Missing challenges in response")
        else:
            log_fail("GET /admin/challenges", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /admin/challenges", str(e))
    
    # Test 5.12: POST /admin/challenges
    try:
        payload = {
            "name": "$500K Challenge",
            "accountSize": 500000,
            "price": 1999,
            "profitTarget": 8,
            "dailyLossLimit": 5,
            "maximumLoss": 10,
            "leverage": 100,
            "minimumTradingDays": 5,
            "profitSplit": 80
        }
        resp = requests.post(f"{BASE_URL}/admin/challenges", json=payload, headers=headers, timeout=10)
        
        if resp.status_code == 201:
            data = resp.json()
            if 'challenge' in data:
                global new_challenge_id
                new_challenge_id = data['challenge'].get('id')
                check_no_objectid(data, "admin/challenges (POST)")
                log_pass("POST /admin/challenges - created $500K challenge")
            else:
                log_fail("POST /admin/challenges", "Missing challenge in response")
        else:
            log_fail("POST /admin/challenges", f"Expected 201, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("POST /admin/challenges", str(e))
    
    # Test 5.13: PATCH /admin/challenges/{id}
    try:
        if new_challenge_id:
            payload = {"price": 1499}
            resp = requests.patch(f"{BASE_URL}/admin/challenges/{new_challenge_id}", json=payload, headers=headers, timeout=10)
            
            if resp.status_code == 200:
                data = resp.json()
                if 'challenge' in data:
                    challenge = data['challenge']
                    if challenge.get('price') == 1499:
                        log_pass("PATCH /admin/challenges/{id} - price updated to 1499")
                    else:
                        log_fail("PATCH /admin/challenges/{id}", f"Expected price 1499, got {challenge.get('price')}")
                else:
                    log_fail("PATCH /admin/challenges/{id}", "Missing challenge in response")
            else:
                log_fail("PATCH /admin/challenges/{id}", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("PATCH /admin/challenges/{id}", str(e))
    
    # Test 5.14: DELETE /admin/challenges/{id}
    try:
        if new_challenge_id:
            resp = requests.delete(f"{BASE_URL}/admin/challenges/{new_challenge_id}", headers=headers, timeout=10)
            
            if resp.status_code == 200:
                # Verify status is DISABLED
                resp2 = requests.get(f"{BASE_URL}/admin/challenges", headers=headers, timeout=10)
                if resp2.status_code == 200:
                    data = resp2.json()
                    challenges = data.get('challenges', [])
                    deleted_challenge = next((c for c in challenges if c.get('id') == new_challenge_id), None)
                    if deleted_challenge and deleted_challenge.get('status') == 'DISABLED':
                        log_pass("DELETE /admin/challenges/{id} - status set to DISABLED")
                    else:
                        log_warning("DELETE /admin/challenges/{id}", "Challenge not found or status not DISABLED")
                        log_pass("DELETE /admin/challenges/{id}")
                else:
                    log_pass("DELETE /admin/challenges/{id}")
            else:
                log_fail("DELETE /admin/challenges/{id}", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("DELETE /admin/challenges/{id}", str(e))
    
    # Test 5.15: GET /admin/payouts
    try:
        resp = requests.get(f"{BASE_URL}/admin/payouts", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'payouts' in data:
                payouts = data['payouts']
                if len(payouts) > 0:
                    # Check for ownerName
                    if 'ownerName' in payouts[0]:
                        global test_payout_id
                        test_payout_id = payouts[0].get('id')
                        check_no_objectid(data, "admin/payouts")
                        log_pass(f"GET /admin/payouts - {len(payouts)} payouts with ownerName")
                    else:
                        log_fail("GET /admin/payouts", "Missing ownerName in payouts")
                else:
                    log_warning("GET /admin/payouts", "No payouts returned")
                    log_pass("GET /admin/payouts")
            else:
                log_fail("GET /admin/payouts", "Missing payouts in response")
        else:
            log_fail("GET /admin/payouts", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /admin/payouts", str(e))
    
    # Test 5.16: GET /admin/payouts?status=REQUESTED
    try:
        resp = requests.get(f"{BASE_URL}/admin/payouts?status=REQUESTED", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'payouts' in data:
                payouts = data['payouts']
                requested_payouts = [p for p in payouts if p.get('status') == 'REQUESTED']
                if len(requested_payouts) == len(payouts):
                    log_pass("GET /admin/payouts?status=REQUESTED - filter works")
                else:
                    log_fail("GET /admin/payouts?status=REQUESTED", f"Filter failed: {len(requested_payouts)}/{len(payouts)} are REQUESTED")
            else:
                log_fail("GET /admin/payouts?status=REQUESTED", "Missing payouts in response")
        else:
            log_fail("GET /admin/payouts?status=REQUESTED", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /admin/payouts?status=REQUESTED", str(e))
    
    # Test 5.17: PATCH /admin/payouts/{id}/status
    try:
        if test_payout_id:
            payload = {"status": "PAID"}
            resp = requests.patch(f"{BASE_URL}/admin/payouts/{test_payout_id}/status", json=payload, headers=headers, timeout=10)
            
            if resp.status_code == 200:
                # Verify processedAt is set
                resp2 = requests.get(f"{BASE_URL}/admin/payouts", headers=headers, timeout=10)
                if resp2.status_code == 200:
                    data = resp2.json()
                    payouts = data.get('payouts', [])
                    updated_payout = next((p for p in payouts if p.get('id') == test_payout_id), None)
                    if updated_payout and updated_payout.get('processedAt'):
                        log_pass("PATCH /admin/payouts/{id}/status - set to PAID, processedAt set")
                    else:
                        log_warning("PATCH /admin/payouts/{id}/status", "processedAt not set")
                        log_pass("PATCH /admin/payouts/{id}/status")
                else:
                    log_pass("PATCH /admin/payouts/{id}/status")
            else:
                log_fail("PATCH /admin/payouts/{id}/status", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("PATCH /admin/payouts/{id}/status", str(e))
    
    # Test 5.18: GET /admin/kyc
    try:
        resp = requests.get(f"{BASE_URL}/admin/kyc", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'kyc' in data:
                check_no_objectid(data, "admin/kyc")
                log_pass("GET /admin/kyc")
            else:
                log_fail("GET /admin/kyc", "Missing kyc in response")
        else:
            log_fail("GET /admin/kyc", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /admin/kyc", str(e))
    
    # Test 5.19: GET /admin/trades
    try:
        resp = requests.get(f"{BASE_URL}/admin/trades", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'trades' in data:
                check_no_objectid(data, "admin/trades")
                log_pass("GET /admin/trades")
            else:
                log_fail("GET /admin/trades", "Missing trades in response")
        else:
            log_fail("GET /admin/trades", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /admin/trades", str(e))
    
    # Test 5.20: GET /admin/transactions
    try:
        resp = requests.get(f"{BASE_URL}/admin/transactions", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'transactions' in data:
                check_no_objectid(data, "admin/transactions")
                log_pass("GET /admin/transactions")
            else:
                log_fail("GET /admin/transactions", "Missing transactions in response")
        else:
            log_fail("GET /admin/transactions", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /admin/transactions", str(e))
    
    # Test 5.21: GET /admin/audit-logs
    try:
        resp = requests.get(f"{BASE_URL}/admin/audit-logs", headers=headers, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            if 'logs' in data:
                check_no_objectid(data, "admin/audit-logs")
                log_pass("GET /admin/audit-logs")
            else:
                log_fail("GET /admin/audit-logs", "Missing logs in response")
        else:
            log_fail("GET /admin/audit-logs", f"Expected 200, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_fail("GET /admin/audit-logs", str(e))

# ============================================================================
# MAIN
# ============================================================================

def main():
    print("\n" + "="*70)
    print("FundedTechStreet Backend API Test Suite")
    print("="*70)
    print(f"Base URL: {BASE_URL}")
    print(f"Demo Trader: {DEMO_TRADER_EMAIL}")
    print(f"Admin: {ADMIN_EMAIL}")
    print("="*70)
    
    # Run all tests
    test_auth()
    test_public()
    test_trader()
    test_rbac()
    test_admin()
    
    # Print summary
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    print(f"✅ PASSED: {len(test_results['passed'])}")
    print(f"❌ FAILED: {len(test_results['failed'])}")
    print(f"⚠️  WARNINGS: {len(test_results['warnings'])}")
    
    if test_results['failed']:
        print("\n" + "="*70)
        print("FAILED TESTS:")
        print("="*70)
        for failure in test_results['failed']:
            print(f"❌ {failure['test']}")
            print(f"   {failure['reason']}")
    
    if test_results['warnings']:
        print("\n" + "="*70)
        print("WARNINGS:")
        print("="*70)
        for warning in test_results['warnings']:
            print(f"⚠️  {warning['test']}")
            print(f"   {warning['message']}")
    
    print("\n" + "="*70)
    print("TEST COMPLETE")
    print("="*70)

if __name__ == "__main__":
    main()
