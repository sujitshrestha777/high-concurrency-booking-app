
import { redisConnection } from "./redis";
 
export const trylockseat=async(seatId:string)=>{
    const lockKey=`lock:seat:${seatId}`;
    try {
        const result = await redisConnection.set(lockKey,"locked","PX",420000,"NX")
        if(result==="OK"){
            console.log("successfully added the seat to lock in redis",result);
            console.log(" lockkey",lockKey);
            return true;
        }

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