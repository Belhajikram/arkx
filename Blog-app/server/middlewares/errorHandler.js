
const errorhandler = (error, req, res) => {
     console.log(err);
     res.status(500).json({err: err.message})
};

