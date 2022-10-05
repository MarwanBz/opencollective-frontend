import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';

import { getGithubRepos } from '../../lib/api';

import NextIllustration from '../collectives/HomeNextIllustration';
import GithubRepositoriesFAQ from '../faqs/GithubRepositoriesFAQ';
import { Box, Flex, Grid } from '../Grid';
import { getI18nLink } from '../I18nFormatters';
import Link from '../Link';
import Loading from '../Loading';
import MessageBox from '../MessageBox';
import StyledButton from '../StyledButton';
import StyledInputField from '../StyledInputField';
import StyledLink from '../StyledLink';
import { H1, P } from '../Text';

import GithubRepositories from './GithubRepositories';

class ConnectGithub extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    setGithubInfo: PropTypes.func.isRequired,
    githubInfo: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      loadingRepos: false,
      repositories: [],
      error: null,
    };
  }

  async componentDidMount() {
    this.setState({ loadingRepos: true });

    try {
      const repositories = await getGithubRepos(this.props.router.query.token);
      if (repositories.length !== 0) {
        this.setState({ repositories, loadingRepos: false });
      } else {
        this.setState({
          loadingRepos: false,
          error: "We couldn't find any repositories with at least 100 stars linked to this account",
        });
      }
    } catch (error) {
      this.setState({
        loadingRepos: false,
        error: error.toString(),
      });
    }
  }

  render() {
    const { repositories, loadingRepos, error } = this.state;
    const { query } = this.props.router;
    const nextLinkPath = query.collectiveSlug
      ? `/opensource/apply/form?collectiveSlug=${query.collectiveSlug}`
      : '/opensource/apply/form';

    return (
      <Flex flexDirection="column" m={[3, 0]} mb={4}>
        <Flex flexDirection="column" my={[2, 4]}>
          <Flex flexDirection={['column', 'row']} alignItems="center" justifyContent="center">
            <Box width={'160px'} height={'160px'} mb="24px">
              <NextIllustration
                alt="Open Source Collective logotype"
                src="/static/images/osc-logo.png"
                width={160}
                height={160}
              />
            </Box>
            <Box textAlign={['center', 'left']} width={['288px', '404px']} mb={4} ml={[null, '24px']}>
              <H1
                fontSize="32px"
                lineHeight="40px"
                letterSpacing="-0.008em"
                color="black.900"
                textAlign={['center', 'left']}
                mb="14px"
                data-cy="connect-github-header"
              >
                <FormattedMessage id="openSourceApply.GithubRepositories.title" defaultMessage="Pick a repository" />
              </H1>
              <P fontSize="16px" lineHeight="24px" fontWeight="500" color="black.700">
                <FormattedMessage
                  id="collective.subtitle.seeRepo"
                  defaultMessage="Don't see the repository you're looking for? {helplink}."
                  values={{
                    helplink: (
                      <StyledLink
                        href="https://docs.opencollective.com/help/collectives/osc-verification"
                        openInNewTab
                        color="purple.500"
                      >
                        <FormattedMessage id="getHelp" defaultMessage="Get help" />
                      </StyledLink>
                    ),
                  }}
                />
              </P>
              <P fontSize="16px" lineHeight="24px" fontWeight="500" color="black.700">
                <FormattedMessage
                  defaultMessage="Want to apply using an <AltVerificationLink>alternative verification criteria</AltVerificationLink>? <ApplyLink>Click here</ApplyLink>."
                  values={{
                    ApplyLink: getI18nLink({
                      as: Link,
                      href: { pathname: `/opensource/create/form`, query: { hostTos: true } },
                      color: 'purple.500',
                    }),
                    AltVerificationLink: getI18nLink({
                      openInNewTab: true,
                      href: 'https://www.oscollective.org/#criteria',
                      color: 'purple.500',
                    }),
                  }}
                />
              </P>
            </Box>
          </Flex>
        </Flex>
        {error && (
          <Flex alignItems="center" justifyContent="center">
            <MessageBox type="error" withIcon mb={[1, 3]}>
              {error}
            </MessageBox>
          </Flex>
        )}
        {loadingRepos && (
          <Box pb={4}>
            <Loading />
          </Box>
        )}

        {repositories.length !== 0 && (
          <Flex justifyContent="center" width={1} mb={4} flexDirection={['column', 'row']}>
            <Box width={1 / 5} display={['none', null, 'block']} />
            <Box maxWidth={[400, 500]} minWidth={[300, 400]} alignSelf={['center', 'none']}>
              <StyledInputField htmlFor="collective">
                {fieldProps => (
                  <GithubRepositories
                    {...fieldProps}
                    repositories={repositories}
                    setGithubInfo={githubInfo => this.props.setGithubInfo(githubInfo)}
                  />
                )}
              </StyledInputField>

              <Grid gridTemplateColumns={['1fr', '1fr 1fr']} gridGap={'32px'} my={4}>
                <StyledButton
                  buttonStyle="purpleSecondary"
                  buttonSize="large"
                  textAlign="center"
                  onClick={() => window && window.history.back()}
                >
                  ←&nbsp;
                  <FormattedMessage id="Back" defaultMessage="Back" />
                </StyledButton>
                <StyledButton
                  textAlign="center"
                  buttonSize="large"
                  buttonStyle="purple"
                  disabled={!this.props.githubInfo}
                  onClick={() => {
                    this.props.router.push(nextLinkPath);
                  }}
                  data-cy="connect-github-continue"
                >
                  <FormattedMessage id="Pagination.Next" defaultMessage="Next" /> &nbsp;→
                </StyledButton>
              </Grid>
            </Box>

            <GithubRepositoriesFAQ
              mt={4}
              ml={[0, 4]}
              display={['block', null, 'block']}
              width={[1, 1 / 5]}
              maxWidth={[250, null, 335]}
              alignSelf={['center', 'flex-start']}
              position="sticky"
              top={0}
              pt={[0, 3]}
            />
          </Flex>
        )}
      </Flex>
    );
  }
}

export default withRouter(ConnectGithub);
