module.exports = function handler(_req, res) {
    return res.status(200).json({
        success: true,
        message: 'Simple test works',
        timestamp: new Date().toISOString()
    });
};
