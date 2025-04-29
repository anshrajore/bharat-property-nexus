
const getCersaiData = (requestData) => {
  // 10% chance of failure for testing error flows
  if (Math.random() < 0.1) {
    throw new Error('CERSAI service unavailable');
  }

  // 20% chance of not finding the property
  if (Math.random() < 0.2) {
    return {
      source: 'CERSAI',
      status: 'notFound',
      message: 'No security interest records found with the given details',
      data: null
    };
  }

  // Success case
  return {
    source: 'CERSAI',
    status: 'found',
    data: {
      assetId: `CERSAI-${Math.floor(Math.random() * 10000000)}`,
      borrowerName: requestData.ownerName,
      securityType: 'Immovable Property',
      creationDate: new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toLocaleDateString(),
      securedCreditor: ['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank'][Math.floor(Math.random() * 4)],
      propertyDescription: requestData.address ? 
        `${requestData.address.line}, ${requestData.address.district}, ${requestData.address.state}` : 
        'Property description not provided',
      chargeAmount: `₹ ${Math.floor(Math.random() * 7000000) + 1000000}`,
      status: Math.random() > 0.2 ? 'Active' : 'Satisfied',
      registrationNumber: requestData.registrationNumber || `CERSAI/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}`,
      chargeHolders: [
        {
          name: ['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank'][Math.floor(Math.random() * 4)],
          priority: '1st Charge',
          contactDetails: 'contact@bank.com'
        }
      ]
    }
  };
};

module.exports = { getCersaiData };
