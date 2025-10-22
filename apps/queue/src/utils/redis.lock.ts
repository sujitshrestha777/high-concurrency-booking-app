
import { redisConnection } from "./redis.js";
 
export const trylockseat=async(seatId:string)=>{
    const lockKey=`lock:seat:${seatId}`;
    try {
        const result = await redisConnection.set(lockKey,"locked","PX",420000,"NX")// for 7 mins
        if(result==="OK"){
            console.log("successfully added the seat to lock in redis",result);
            console.log(" lockkey",lockKey);
            return true;
        }
        return false
    } catch (error) {
       console.log(`something went wrong while locking the seat${seatId}`,error);
       return false 
    }
}
export const releaseSeatLock=async(seatId:string)=>{
        const lockKey=`lock:seat:${seatId}`;
        try {
            const result=await redisConnection.del(lockKey);
            if(result===1){
                console.log(` deleted the locked seat ${seatId}`); 
                return result  
            }
             if(result===0){
                console.log(`the locked seat ${seatId} doesnot exist`);  
                return result 
            }
            return result
        } catch (error) {
            console.log("error while deleting the lockseat ",error);
            return false;
        }
}
export const isSeatLocked = async (seatId: string): Promise<boolean> => {
    const lockKey = `lock:seat:${seatId}`;
    console.log(`[Lock] Checking if ${lockKey} is locked`);
    try {
        const exists = await redisConnection.exists(lockKey);
        const isLocked = exists === 1;
        console.log(`[Lock] ${lockKey} is locked: ${isLocked}`);
        return isLocked;
    } catch (error) {
        console.error(`[Lock] An error occurred while checking lock status for ${seatId}:`, error);
        return false;
    }
};
export const withSeatLock=async<T>(seatId:string,callback:()=>Promise<T>)=>{
    let lockAcquired= false ;
    try {
        lockAcquired=await trylockseat(seatId);
        if(!lockAcquired){
            console.log(`skkiping callback execuiton as couldnot lock the seat ${seatId}`);
            return null;
        }
        console.log(`lock aquired for the seat${seatId} execution callbacke`);
        const reslut=await callback()
        console.log(`callback excuted succesfully now fro seat ${seatId}`);
        return reslut;
    } catch (error) {
        console.log(`error ocured while locking in withseatlock error:${error}`);
        throw error
    }finally{
         if (lockAcquired) {
            await releaseSeatLock(seatId);
            console.log(` Lock for seat ${seatId} released `);
        }
    } 
}