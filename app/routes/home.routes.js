const homeRoute = async (req, res) => {
    res.status(200).json({
        "success": true,
        "message": 'Todo bien, todo correcto y yo que me alegroo. 222 😎',
        "data": null
    });
}

module.exports = homeRoute;
