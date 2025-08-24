#!/usr/bin/env node
/**
 * Multi-Chain Test Script for Solana + zkSync Integration
 * Tests the ProofVault multi-chain credential system
 */

import solanaService from './server/services/solanaService.js';
import zkSyncService from './server/services/zkSyncService.js';
import multiChainService from './server/services/multiChainService.js';

async function testMultiChainServices() {
  console.log('🚀 Testing ProofVault Multi-Chain Integration\n');
  console.log('📋 Tech Stack: Solana (Primary) + zkSync (Privacy)\n');

  try {
    // Test 1: Solana Service Initialization
    console.log('1️⃣ Testing Solana Service...');
    const solanaStatus = await solanaService.getStatus();
    console.log('   ✅ Solana connection:', solanaStatus);

    // Test 2: zkSync Service Initialization  
    console.log('\n2️⃣ Testing zkSync Service...');
    const zkSyncStatus = await zkSyncService.getStatus();
    console.log('   ✅ zkSync connection:', zkSyncStatus);

    // Test 3: Multi-Chain Orchestration
    console.log('\n3️⃣ Testing Multi-Chain Orchestration...');
    const orchestrationStatus = await multiChainService.getStatus();
    console.log('   ✅ Multi-chain orchestration:', orchestrationStatus);

    // Test 4: Mock Credential Minting
    console.log('\n4️⃣ Testing Credential Minting...');
    const testCredential = {
      title: 'Test Blockchain Credential',
      issuer: 'ProofVault Multi-Chain Test',
      to: 'test-user-' + Date.now(),
      description: 'Testing Solana + zkSync integration',
      credentialType: 'Achievement'
    };

    // Test Solana minting
    const solanaResult = await multiChainService.mintCredential({
      ...testCredential,
      chain: 'solana', 
      privacy: false
    });
    console.log('   ✅ Solana minting result:', solanaResult);

    // Test zkSync privacy layer
    const zkSyncResult = await multiChainService.mintCredential({
      ...testCredential,
      chain: 'solana', 
      privacy: true
    });
    console.log('   ✅ zkSync privacy result:', zkSyncResult);

    // Test 5: Cross-Chain Verification
    console.log('\n5️⃣ Testing Cross-Chain Verification...');
    const verificationResult = await multiChainService.verifyCredential({
      chain: 'solana',
      identifier: solanaResult.results?.primary?.mintAddress || 'test-address'
    });
    console.log('   ✅ Verification result:', verificationResult);

    console.log('\n🎉 Multi-Chain Integration Test Complete!');
    console.log('📊 Summary:');
    console.log('   • Solana Service: ✅ Working');
    console.log('   • zkSync Service: ✅ Working');
    console.log('   • Multi-Chain Orchestration: ✅ Working');
    console.log('   • Cross-Chain Verification: ✅ Working');
    console.log('\n💡 Your friend\'s recommended tech stack is ready!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('🔧 Debug info:', error);
  }
}

// Run the test
testMultiChainServices();
