import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { getAccessToken } from "../auth";

const HOST_URL = "http://localhost:9000/graphql";

export const client = new ApolloClient({
  uri: HOST_URL,
  cache: new InMemoryCache(),
});

const JOB_DETAIL_FRAGMENT = gql`
  fragment JobDetail on Job {
    id
    title
    description
    company {
      id
      name
    }
  }
`;

export const JOBS_QUERY = gql`
  query {
    jobs {
      id
      title
      description
      company {
        id
        name
        description
      }
    }
  }
`;

export const JOB_QUERY = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${JOB_DETAIL_FRAGMENT}
`;

export const COMPANY_QUERY = gql`
  query CompanyQuery($companyId: ID!) {
    company(id: $companyId) {
      id
      name
      description
      jobs {
        id
        title
        description
      }
    }
  }
`;

export const CREATE_JOB_MUTATION = gql`
  mutation CreateJobMutation($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${JOB_DETAIL_FRAGMENT}
`;

export async function deleteJob(id) {
  const mutation = gql`
    mutation DeleteJobMutation($id: ID!) {
      job: deleteJob(id: $id) {
        id
      }
    }
  `;

  const variables = { id };
  const token = getAccessToken();
  const context = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const {
    data: { job },
  } = await client.mutate({ mutation, variables, context });
  return job;
}
