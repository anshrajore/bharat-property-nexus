
const getMcaData = (requestData) => {
  // 10% chance of failure for testing error flows
  if (Math.random() < 0.1) {
    throw new Error('MCA21 service unavailable');
  }

  // 20% chance of not finding the property
  if (Math.random() < 0.2) {
    return {
      source: 'MCA21',
      status: 'notFound',
      message: 'No company property records found with the given details',
      data: null
    };
  }

  // Success case
  const companyName = `${requestData.ownerName} Enterprises Ltd.`;
  
  return {
    source: 'MCA21',
    status: 'found',
    data: {
      companyName: companyName,
      cin: `U${Math.floor(Math.random() * 10000000)}DL${new Date().getFullYear()}PTC${Math.floor(Math.random() * 100000)}`,
      companyStatus: Math.random() > 0.1 ? 'Active' : 'Struck Off',
      address: requestData.address ? 
        `${requestData.address.line}, ${requestData.address.district}, ${requestData.address.state} - ${requestData.address.pincode}` : 
        'Corporate Address',
      dateOfIncorporation: new Date(Date.now() - Math.floor(Math.random() * 315360000000)).toLocaleDateString(),
      authorizedCapital: `₹ ${Math.floor(Math.random() * 90000000) + 10000000}`,
      paidUpCapital: `₹ ${Math.floor(Math.random() * 9000000) + 1000000}`,
      companyCategory: Math.random() > 0.5 ? 'Private' : 'Public',
      properties: [
        {
          propertyId: requestData.propertyId || `PROP${Math.floor(Math.random() * 1000000)}`,
          propertyType: requestData.urban ? 'Corporate Office' : 'Industrial Land',
          address: requestData.address ? 
            `${requestData.address.line}, ${requestData.address.district}, ${requestData.address.state}` : 
            'Property Address',
          area: `${800 + Math.floor(Math.random() * 7000)} sq.ft`,
          ownershipType: 'Owned',
          acquisitionDate: new Date(Date.now() - Math.floor(Math.random() * 157680000000)).toLocaleDateString()
        }
      ],
      directors: [
        {
          name: requestData.ownerName,
          din: `DIN${Math.floor(Math.random() * 10000000)}`,
          designation: 'Director'
        }
      ]
    }
  };
};

module.exports = { getMcaData };
