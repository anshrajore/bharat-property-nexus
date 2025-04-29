
const getDlrData = (requestData) => {
  // 10% chance of failure for testing error flows
  if (Math.random() < 0.1) {
    throw new Error('DLR service unavailable');
  }

  // 20% chance of not finding the property
  if (Math.random() < 0.2) {
    return {
      source: 'DLR',
      status: 'notFound',
      message: 'No land records found with the given details',
      data: null
    };
  }

  // Success case
  return {
    source: 'DLR',
    status: 'found',
    data: {
      ownerName: requestData.ownerName,
      surveyNumber: requestData.propertyId || `KH-${Math.floor(Math.random() * 100)}/${Math.floor(Math.random() * 100)}`,
      khataNumber: `KHATA/${Math.floor(Math.random() * 10000)}`,
      landType: requestData.urban ? 'Urban Development Authority' : 'Agricultural',
      area: requestData.urban ? `${800 + Math.floor(Math.random() * 700)} sq.ft` : `${Math.random().toFixed(2)} hectares`,
      village: requestData.address?.district || 'Sample Village',
      district: requestData.address?.district || 'Sample District',
      state: requestData.address?.state || 'Sample State',
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toLocaleDateString(),
      landUse: requestData.urban ? 'Residential' : 'Farming',
      mutationHistory: [
        {
          date: new Date(Date.now() - Math.floor(Math.random() * 63072000000)).toLocaleDateString(),
          previousOwner: 'Previous Owner Name',
          newOwner: requestData.ownerName,
          transactionType: 'Sale Deed'
        }
      ],
      taxStatus: Math.random() > 0.8 ? 'Pending' : 'Paid'
    }
  };
};

module.exports = { getDlrData };
