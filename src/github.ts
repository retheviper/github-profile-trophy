export async function fetchGraphQLStats(username: string, token: string) {
  const query = `
    query ($login: String!) {
      user(login: $login) {
        name
        createdAt
        followers {
          totalCount
        }
        contributionsCollection {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          contributionCalendar {
            totalContributions
          }
        }
        repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
          nodes {
            stargazerCount
          }
          totalCount
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  const json = await res.json();
  const u = json.data.user;
  const starCount = u.repositories.nodes.reduce((sum: number, repo: any) => sum + repo.stargazerCount, 0);
  const createdAt = new Date(u.createdAt);
  const today = new Date();
  const durationDays = Math.floor((today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

  return {
    name: u.name,
    totalFollowers: u.followers.totalCount,
    totalRepositories: u.repositories.totalCount,
    totalStargazers: starCount,
    totalCommits: u.contributionsCollection.totalCommitContributions,
    totalIssues: u.contributionsCollection.totalIssueContributions,
    totalPullRequests: u.contributionsCollection.totalPullRequestContributions,
    totalReviews: u.contributionsCollection.totalPullRequestReviewContributions,
    durationDays
  };
}
