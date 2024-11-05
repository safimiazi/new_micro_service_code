const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nahid Application programming interface ",
      version: "1.0.0",
      description: "A description of your API",
    },
    servers: [
      {
        url: "http://localhost:5000", // Your server URL
      },
    ],
  },
  apis: ["./src/routers/*.ts"], // Path to the API docs
};

export default swaggerOptions;
