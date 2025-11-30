import Redis from 'ioredis'


let redis:Redis|null=null

export function getRedis():Redis {
    if(!redis){
        redis= new Redis(process.env.REDIS_URL||"redis://localhost:6379",{
            maxRetriesPerRequest:3,
            enableReadyCheck:true,
            lazyConnect:false
        })
        redis.on('error',(error)=> console.log("error in redis client connection",error))
        redis.on('connect',()=>console.log("redis cleint has been successfully connected"))
    }
    return redis
}