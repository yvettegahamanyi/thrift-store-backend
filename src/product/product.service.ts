import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.prisma.product.create({
        data: createProductDto,
      });

      return {
        data: product,
        message: 'Product created successfully',
        code: 201,
      };
    } catch (error) {
      console.error('Error creating product:', error);

      if (error instanceof Error) {
        throw new Error(`Failed to create product: ${error.message}`);
      }

      throw new Error(
        'An unexpected error occurred while creating the product.',
      );
    }
  }

  findAll() {
    const products = this.prisma.product.findMany();
    return {
      data: products,
      message: 'Products fetched successfully',
      code: 200,
    };
  }

  findOne(id: string) {
    const product = this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) {
      return {
        data: null,
        message: 'Product not found',
        code: 404,
      };
    }
    return {
      data: product,
      message: 'Product fetched successfully',
      code: 200,
    };
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    //check if the product exist
    const product = this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) {
      return {
        data: null,
        message: 'Product not found',
        code: 404,
      };
    }
    //update the product
    const updatedProduct = this.prisma.product.update({
      where: {
        id: id,
      },
      data: updateProductDto,
    });
    return {
      data: updatedProduct,
      message: 'Product updated successfully',
      code: 200,
    };
  }
}
