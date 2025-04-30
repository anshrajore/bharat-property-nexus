
const express = require('express');
const { getDlrData } = require('../mockData/dlrMock');
const { getDorisData } = require('../mockData/dorisMock');
const { getCersaiData } = require('../mockData/cersaiMock');
const { getMcaData } = require('../mockData/mcaMock');
const { validateSearchRequest } = require('../middleware/validation');

const router = express.Router();

// Unified search endpoint - queries all data sources and returns standardized results
router.post('/', validateSearchRequest, async (req, res) => {
  try {
    const searchParams = req.body;
    
    // Create promise array with artificial delays to simulate real-world API behavior
    const portalPromises = [
      new Promise((resolve) => {
        setTimeout(() => {
          try {
            const dorisResult = getDorisData(searchParams);
            resolve({
              source: 'DORIS',
              status: dorisResult.status || 'found',
              data: standardizeData('DORIS', dorisResult.data)
            });
          } catch (error) {
            resolve({
              source: 'DORIS',
              status: 'unavailable',
              message: error.message,
              data: null
            });
          }
        }, 500 + Math.floor(Math.random() * 1000));
      }),
      
      new Promise((resolve) => {
        setTimeout(() => {
          try {
            const dlrResult = getDlrData(searchParams);
            resolve({
              source: 'DLR',
              status: dlrResult.status || 'found',
              data: standardizeData('DLR', dlrResult.data)
            });
          } catch (error) {
            resolve({
              source: 'DLR',
              status: 'unavailable',
              message: error.message,
              data: null
            });
          }
        }, 800 + Math.floor(Math.random() * 1000));
      }),
      
      new Promise((resolve) => {
        setTimeout(() => {
          try {
            const cersaiResult = getCersaiData(searchParams);
            resolve({
              source: 'CERSAI',
              status: cersaiResult.status || 'found',
              data: standardizeData('CERSAI', cersaiResult.data)
            });
          } catch (error) {
            resolve({
              source: 'CERSAI',
              status: 'unavailable',
              message: error.message,
              data: null
            });
          }
        }, 700 + Math.floor(Math.random() * 1000));
      }),
      
      new Promise((resolve) => {
        setTimeout(() => {
          try {
            const mcaResult = getMcaData(searchParams);
            resolve({
              source: 'MCA21',
              status: mcaResult.status || 'found',
              data: standardizeData('MCA21', mcaResult.data)
            });
          } catch (error) {
            resolve({
              source: 'MCA21',
              status: 'unavailable',
              message: error.message,
              data: null
            });
          }
        }, 900 + Math.floor(Math.random() * 1000));
      })
    ];
    
    // Wait for all results with Promise.all
    const results = await Promise.all(portalPromises);
    
    res.json({
      timestamp: new Date().toISOString(),
      results: results,
      unifiedView: mergeResults(results)
    });
    
  } catch (error) {
    console.error('Unified search error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Helper function to standardize data from different sources
function standardizeData(source, data) {
  if (!data) return null;

  // Base structure for standardized data
  const standardized = {
    propertyId: '',
    ownerName: '',
    registrationNumber: '',
    propertyLocation: '',
    coordinates: null,
    propertyType: 'unknown',
    registrationDate: '',
    encumbrances: [],
    sourcePortal: source,
    sourceDocuments: [],
    trustworthinessScore: 0
  };

  // Source-specific mapping logic
  switch (source) {
    case 'DORIS':
      standardized.propertyId = data['Property ID'] || '';
      standardized.ownerName = data['Owner Name'] || '';
      standardized.registrationNumber = data['Registration ID'] || '';
      standardized.propertyLocation = data['Address'] || '';
      standardized.coordinates = data['Location'] || null;
      standardized.propertyType = data['Property Type']?.toLowerCase().includes('urban') ? 'urban' : 'rural';
      standardized.registrationDate = data['Registration Date'] || '';
      standardized.sourceDocuments = ['registration_deed', 'property_card'];
      standardized.trustworthinessScore = 85;
      standardized.encumbrances = [
        {
          type: 'Mortgage',
          holder: 'Not Available',
          status: 'active'
        }
      ];
      break;
    
    case 'DLR':
      standardized.propertyId = data['Survey Number'] || '';
      standardized.ownerName = data['Owner'] || '';
      standardized.propertyLocation = data['Address'] || `${data['Village/Ward'] || ''}, ${data['District'] || ''}, ${data['State'] || ''}`;
      standardized.coordinates = data['Location'] || null;
      standardized.propertyType = data['Land Type']?.toLowerCase().includes('urban') ? 'urban' : 'rural';
      standardized.registrationDate = '';
      standardized.sourceDocuments = ['land_record', 'revenue_receipt'];
      standardized.trustworthinessScore = 80;
      standardized.encumbrances = [
        {
          type: 'Land Use Restriction',
          holder: 'Land Revenue Department',
          status: 'active'
        }
      ];
      break;
      
    case 'CERSAI':
      standardized.propertyId = data['Asset ID'] || '';
      standardized.ownerName = data['Borrower Name'] || '';
      standardized.propertyLocation = data['Address'] || `${data['District'] || ''}, ${data['State'] || ''}`;
      standardized.coordinates = data['Location'] || null;
      standardized.propertyType = data['Security Type']?.toLowerCase().includes('movable') ? 'urban' : 'rural';
      standardized.registrationDate = data['Creation Date'] || '';
      standardized.sourceDocuments = ['security_agreement', 'charge_document'];
      standardized.trustworthinessScore = 90;
      standardized.encumbrances = [
        {
          type: 'Security Interest',
          holder: data['Secured Creditor'] || 'Unknown Bank',
          value: data['Charge Amount'] || '',
          status: data['Status']?.toLowerCase() === 'active' ? 'active' : 'discharged'
        }
      ];
      break;
      
    case 'MCA21':
      standardized.propertyId = data['CIN'] || '';
      standardized.ownerName = data['Company Name'] || '';
      standardized.propertyLocation = data['Address'] || `${data['District'] || ''}, ${data['State'] || ''}`;
      standardized.coordinates = data['Location'] || null;
      standardized.propertyType = 'urban'; // Assuming corporate properties are urban
      standardized.registrationDate = data['Date of Incorporation'] || '';
      standardized.sourceDocuments = ['incorporation_certificate', 'annual_return'];
      standardized.trustworthinessScore = 75;
      standardized.encumbrances = [
        {
          type: 'Corporate Charge',
          holder: 'Ministry of Corporate Affairs',
          value: data['Paid Up Capital'] || '',
          status: 'active'
        }
      ];
      break;
  }

  return standardized;
}

// Function to merge results from multiple sources into a unified view
function mergeResults(results) {
  // Filter out unavailable or notFound results
  const validResults = results.filter(r => r.status === 'found' && r.data);
  
  if (validResults.length === 0) {
    return null;
  }
  
  // Start with data from the most trusted source (assuming CERSAI is most trusted)
  let primarySource = validResults.find(r => r.source === 'CERSAI')?.data;
  if (!primarySource) {
    primarySource = validResults.find(r => r.source === 'DORIS')?.data;
  }
  if (!primarySource) {
    primarySource = validResults.find(r => r.source === 'DLR')?.data;
  }
  if (!primarySource) {
    primarySource = validResults.find(r => r.source === 'MCA21')?.data;
  }
  
  // If no valid data, return null
  if (!primarySource) {
    return null;
  }
  
  // Merge encumbrances from all sources
  const allEncumbrances = [];
  validResults.forEach(result => {
    if (result.data && result.data.encumbrances && Array.isArray(result.data.encumbrances)) {
      const sourceEncumbrances = result.data.encumbrances.map(e => ({
        ...e,
        source: result.source
      }));
      allEncumbrances.push(...sourceEncumbrances);
    }
  });
  
  // Merge source documents from all sources
  const allSourceDocuments = [];
  validResults.forEach(result => {
    if (result.data && result.data.sourceDocuments && Array.isArray(result.data.sourceDocuments)) {
      const sourceDocuments = result.data.sourceDocuments.map(doc => ({
        name: doc,
        source: result.source
      }));
      allSourceDocuments.push(...sourceDocuments);
    }
  });
  
  // Return merged data
  return {
    ...primarySource,
    encumbrances: allEncumbrances,
    sourceDocuments: allSourceDocuments,
    dataSources: validResults.map(r => r.source),
    lastUpdated: new Date().toISOString()
  };
}

module.exports = router;
