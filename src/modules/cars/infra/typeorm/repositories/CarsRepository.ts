import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { getRepository, Repository } from "typeorm";
import { Car } from "../entities/Car";


class CarsRepository implements ICarsRepository {

    private repository: Repository<Car>

    constructor() {
        this.repository = getRepository(Car);
    }

    async create({
        brand,
        category_id,
        daily_rate,
        fine_amount,
        license_plate,
        name,
        description,
        specifications,
        id
    }: ICreateCarDTO): Promise<Car> {
        const car = this.repository.create({
            brand,
            category_id,
            daily_rate,
            fine_amount,
            license_plate,
            name,
            description,
            specifications,
            id
        });

        await this.repository.save(car);
        return car;
    } 

    async findByLicensePlate(license_plate: string): Promise<Car> {
        const car = await this.repository.findOne({
            license_plate
        });

        return car;
    }

    async findAvailable(
        brand?: string,
        category_id?: string,
        name?: string
    ): Promise<Car[]> {
        const carsQuery = await this.repository
        .createQueryBuilder("c")
        .where("available = :available", { available: true });

        if(brand)
            carsQuery.andWhere("c.brand = :brand", { brand });

        if(category_id)
            carsQuery.andWhere("c.category_id = :category_id", { category_id });

        if(name)
            carsQuery.andWhere("c.name = :name", { name });

        const cars = await carsQuery.getMany();
        return cars;
    }

    async findById(id: string): Promise<Car> {
        const car = await this.repository.findOne(id);
        return car;
    }

    async updateAvailability(id: string, available: boolean): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update()
            .set({ available })
            .where("id = :id")
            .setParameter("id", id)
            .execute();
    }

}

export { CarsRepository }