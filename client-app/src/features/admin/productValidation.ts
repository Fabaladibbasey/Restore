import * as yup from "yup";

export const productValidationSchema = yup.object({
    name: yup.string().required("Product name is required"),
    description: yup.string().required("Product description is required"),
    price: yup.number().required("Product price is required").moreThan(100, "Price must be greater than 100"),
    quantityInStock: yup.number().required("Product quantity is required").moreThan(0, "Quantity must be greater than 0"),
    brand: yup.string().required("Product brand is required"),
    type: yup.string().required("Product type is required"),
    file: yup.mixed().when("pictureUrl", {
        is: (pictureUrl: string) => !pictureUrl,
        then: (schema) => schema.required("Product image is required"),
        otherwise: (schema) => schema.notRequired()
    })
});
