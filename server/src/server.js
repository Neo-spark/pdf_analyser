require ("dotenv").config();

const requiredEnv = ['MONGO_URI', 'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET'];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);
if (missingEnv.length > 0)
{
    throw new Error(`Missing required environment variables: ${missingEnv.join(', ')}`);
}

const connectDB=require('./config/db');

const app=require('./app');
const PORT=process.env.PORT || 3000;

connectDB();   //connect to the database

app.listen(PORT,()=>
{
    console.log(`Backend connected at http://localhost:${PORT}`);
});
