import GenericRepository from "./GenericRepository.js";

export default class PetRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }
    getPetsBySpecie=(specie)=>{
        return this.getBy({specie});
    }
}