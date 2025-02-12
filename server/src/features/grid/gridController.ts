import { Request, Response } from "express";

import { GridCharacter } from "./types";
import { getGridMethod } from "./gridMethods";
import { getGridSchema } from "./gridSchema";

interface TypedRequest extends Request {
  query: {
    bias: GridCharacter;
  };
}

const getGridController = (request: TypedRequest, response: Response) => {
  const validation = getGridSchema.safeParse(request.query);

  if (!validation.success) {
    response.status(400).json({ errors: validation.error.format() });
  }

  const bias: GridCharacter | undefined = validation.data!.bias;
  const gridAndSecretCode = getGridMethod(bias);
  response.send(gridAndSecretCode);
};

export { getGridController };
