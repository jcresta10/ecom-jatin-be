import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<{
        id: string;
        name: string;
        description: string;
        price: number;
        stock: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
