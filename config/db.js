import mongoose from 'mongoose';

function connect() {
    mongoose.connect(process.env.MongoDbUrl)
    mongoose.connection.once("open", () => {
        console.log("Db Connected")
    })
}

export default connect;