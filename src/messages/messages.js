// Mensaje general 
const generalReturnMessage = (res, status, message, data = null) => {
    return res.status(status).json({message: message, data: data})
}

// Mensaje de error que hara un console log del lugar donde fue originado el error
const internalErrorMessage = (res, file, funcionName, error) => {
    console.log(file + ' ' + funcionName, error.message);
    if (res == null) {
        return {statusCode: 500, message: 'Internal Error', data: null};
    }
    return res.status(500).json({message: 'Internal Error', data: null});
}

module.exports = {
    generalReturnMessage,
    internalErrorMessage
}