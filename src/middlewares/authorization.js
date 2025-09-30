export const authorization=(roles=[])=>{
    return(req, res, next)=>{
        try{
            if(!req.user){
                return res.status(401).send({status: 'error', error: 'Unauthorized'});
            }
            if(!roles.includes(req.user.role)){
                return res.status(403).send({status:'error',error:'Forbidden: insufficient permissions'});
            }
            next();
        }catch(error){
            console.error('Authorization error:', error);
            return res.status(500).send({status: 'error', error: 'Internal Server Error'});
        }
    };
};