// A wrapper for catching async function error without having to add try/catch to every async function. Could be removed if updated to Express 5.
module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};