export default class PetDTO {
    static getPetInputFrom = (pet) =>{
        return {
            name:pet.name||'',
            specie:pet.specie||'',
            image: pet.image||'',
            birthDate:pet.birthDate?new Date(pet.birthDate):new Date('2000-12-30'),
            adopted:false
        }
    }
}