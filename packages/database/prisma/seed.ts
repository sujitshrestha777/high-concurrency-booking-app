console.log("--- SEED FILE LOADED ---")
import { PrismaClient,SeatStatus,ClassTypes } from '@prisma/client';

const prisma = new PrismaClient();

type seat={
seatIdentifier:string,
classType:ClassTypes,
status:SeatStatus,

}

async function main() {
  console.log('Starting database seeding...');

  const seatsToCreate:seat[] = [];

  
  const businessColumns = ['A', 'B', 'D', 'E'];
  for (let row = 1; row <= 13; row++) {
    for (const col of businessColumns) {
      seatsToCreate.push({
        seatIdentifier: `${row}${col}`,
        classType:ClassTypes.BUSINESS, 
        status: SeatStatus.AVAILABLE, 
      });
    }
  }
  console.log(`Generated ${seatsToCreate.length} Business Class seats.`);


  const economyColumns = ['A', 'B', 'C', 'D', 'E', 'F'];
  for (let row = 14; row <= 88; row++) {
    for (const col of economyColumns) {
      seatsToCreate.push({
        seatIdentifier: `${row}${col}`,
        classType:ClassTypes.ECONOMY, 
        status: SeatStatus.AVAILABLE, 
      });
    }
  }
  console.log(`Generated ${seatsToCreate.length - (13 * businessColumns.length)} Economy Class seats.`);
  console.log(`Total seats to create: ${seatsToCreate.length}`);



  const createdSeats = await prisma.seat.createMany({
    data: seatsToCreate,
    skipDuplicates: true, 
  });

  console.log(`Successfully created ${createdSeats.count} seats.`);


  console.log('Database seeding complete!');
}

main()
  .catch(e => {
    console.error('Error during seeding:', e);
    process.exit(1)
  })
  .finally(async () => { 
    console.log("finally>>>>>>>>>>>>>");
    
    await prisma.$disconnect();
  });