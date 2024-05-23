export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  dob: Date;
  email: string;
  address: {
    address: string;
    state: string;
    city: string;
    pincode: number;
  };
  subjects: string[];
  previousEducation: {
    school: string;
    yearStart: Date;
    yearEnd: Date;
  }[];
}



// export interface Student {
//   id: number; 
//   firstName: string;
//   lastName: string;
//   dob: string; 
//   email: string;
//   address: {
//     address: string;
//     state: string;
//     city: string;
//     pincode: string;
//   };
//   subjects: string[];
//   previousEducation: PreviousEducation[];
// }

// export interface PreviousEducation {
//   school: string;
//   yearStart: string; 
//   yearEnd: string; 
// }





// export interface Student {
//   id:number;
//     firstName: string;
//     lastName: string;
//     dob: string;
//     email: string;
//     address: Address;
//     subjects: string[];
//     previousEducation: Education[];
//   }
  
//   export interface Address {
//     address: string;
//     state: string;
//     city: string;
//     pincode: string;
//   }
  
//   export interface Education {
//     school: string;
//     yearStart: string;
//     yearEnd: string;
//   }