const API_URL =
  process.env.CITADEL_API_URL ?? "https://citadel.menew.ir/api";

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function graphqlRequest<T>(
  query: string,
  variables: Record<string, unknown>,
  operationName: string,
): Promise<T | null> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/graphql-response+json, application/json",
    },
    body: JSON.stringify({ query, variables, operationName }),
  });

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  if (json.errors?.length || !json.data) {
    return null;
  }

  return json.data;
}
