import * as sdkssm from "@aws-sdk/client-ssm";

export const getParameterFromSSM = async (
  paramName: string,
) => {
  const client = new sdkssm.SSMClient();
  const command = new sdkssm.GetParameterCommand({
    Name: paramName,
  });
  const response = await client.send(command);
  if (!response.Parameter?.Value) {
    throw new Error(`Parameter not found: ${paramName}`);
  }
  return response.Parameter.Value;
};
