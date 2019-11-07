import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from "typeorm";

@Entity()
class Ride extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({ type: "text", enum: ["ACCEPTED", "FINISHED", "CANCELED", "REQUESTING", "ONROUTE"] })
    status: string

    @Column({ type: "text" })
    pickUpAddress: string

    @Column({ type: "double precision", default: 0 })
    pickUpLat: number;

    @Column({ type: "double precision", default: 0 })
    pickUpLng: number;

    @Column({ type: "text" })
    dropOffAddress: String

    @Column({ type: "double precision", default: 0 })
    dropOffLat: number;

    @Column({ type: "double precision", default: 0 })
    dropOffLng: number;

    @Column({ type: "double precision", default: 0 })
    price: number;

    @Column({ type: "text" })
    distance: string;

    @Column({ type: "text" })
    duration: string;


    @CreateDateColumn() createdAt: string;
    @UpdateDateColumn() updatedAt: string;
}

export default Ride;