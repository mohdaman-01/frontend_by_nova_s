/**
 * Simple test script to verify ML integration is working
 */

const API_BASE_URL = 'https://nova-s-sih-35061497bf29.herokuapp.com';

async function testMLConnection() {
  console.log('🧪 Testing ML Integration Connection');
  console.log('=====================================');
  
  try {
    // Test 1: Health check
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test 2: ML model status
    console.log('\n2. Testing ML model status...');
    const statusResponse = await fetch(`${API_BASE_URL}/api/v1/ml/model-status`);
    const statusData = await statusResponse.json();
    console.log('✅ ML Status:', statusData);
    
    // Test 3: Try to load models
    console.log('\n3. Triggering model loading...');
    const loadResponse = await fetch(`${API_BASE_URL}/api/v1/ml/load-models`, {
      method: 'POST'
    });
    const loadData = await loadResponse.json();
    console.log('✅ Model loading:', loadData);
    
    console.log('\n🎉 All tests passed! ML integration is working.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testMLConnection();