export default class PetDTO {
    static getPetInputFrom = (pet) =>{
        let birthDate=new Date("2000-12-30");
        if(pet.birthDate){
            const parsed=new Date(pet.birthDate);
            if(!isNaN(parsed.getTime())){
                birthDate=parsed;
            }
        }
        return {
            name:pet.name||'',
            specie:pet.specie||'',
            image: pet.image||'',
            birthDate,
            adopted:pet.adopted??false,
        };
    };
}