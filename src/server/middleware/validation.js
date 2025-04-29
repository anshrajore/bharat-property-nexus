
const validateSearchRequest = (req, res, next) => {
  const { ownerName, propertyId, registrationNumber, address } = req.body;
  
  // Check if at least one of these fields is provided
  if (!ownerName && !propertyId && !registrationNumber && !address) {
    return res.status(400).json({
      status: 'error',
      message: 'At least one search parameter is required (ownerName, propertyId, registrationNumber, or address)'
    });
  }

  // Validate address format if provided
  if (address && typeof address === 'object') {
    const { state, pincode } = address;
    
    // Check if state and pincode are provided in the address
    if (!state || !pincode) {
      return res.status(400).json({
        status: 'error',
        message: 'State and pincode are required fields in the address'
      });
    }
    
    // Validate pincode format (6 digits for Indian pincodes)
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid pincode format. Pincode should be 6 digits'
      });
    }
  }

  // Continue to the next middleware or route handler
  next();
};

module.exports = { validateSearchRequest };
