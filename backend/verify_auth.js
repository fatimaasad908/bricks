// verify_auth.js
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:5000/api/auth';
const TEST_EMAIL = `testuser_${Date.now()}@example.com`;
const TEST_PASSWORD = 'password123';

async function runTests() {
  console.log('--- Starting Auth Flow Test ---');

  // Connect briefly to DB to fetch the generated token directly for the test
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI environment variable is not defined in .env');
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);
  console.log('Successfully connected to MongoDB Atlas for verification tests');
  
  try {
    // 1. Signup
    console.log(`\n[1] Signing up user: ${TEST_EMAIL}`);
    const signupRes = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD })
    });
    const signupData = await signupRes.json();
    console.log('Signup Response:', signupRes.status, signupData);

    if (signupRes.status !== 201) throw new Error('Signup failed');

    // 2. Fetch Verification Token from DB
    console.log('\n[2] Fetching verification token from DB...');
    const user = await User.findOne({ email: TEST_EMAIL });
    const token = user.verificationToken;
    console.log('Token extracted:', token);

    // 3. Try Login before verifying (Should Fail)
    console.log('\n[3] Attempting login before verification...');
    const loginFailRes = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD })
    });
    const loginFailData = await loginFailRes.json();
    console.log('Login Response (Unverified):', loginFailRes.status, loginFailData);
    if (loginFailRes.status !== 401) throw new Error('Unverified login should fail');

    // 4. Verify Email
    console.log('\n[4] Verifying email...');
    const verifyRes = await fetch(`${API_URL}/verify/${token}`);
    const verifyData = await verifyRes.json();
    console.log('Verify Response:', verifyRes.status, verifyData);
    if (verifyRes.status !== 200) throw new Error('Verification failed');

    // 5. Login after verifying (Should Succeed)
    console.log('\n[5] Attempting login after verification...');
    const loginSuccessRes = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD })
    });
    const loginSuccessData = await loginSuccessRes.json();
    console.log('Login Response (Verified):', loginSuccessRes.status, loginSuccessData);
    if (loginSuccessRes.status !== 200) throw new Error('Verified login failed');

    console.log('\n--- All Auth Flow Tests Passed Perfectly! ---');
  } catch (error) {
    console.error('\nTest Failed!', error);
  } finally {
    // Teardown
    await User.deleteOne({ email: TEST_EMAIL });
    await mongoose.disconnect();
    process.exit(0);
  }
}

runTests();
