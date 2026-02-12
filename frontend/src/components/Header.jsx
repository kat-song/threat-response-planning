import { Button, GovBanner, Grid, NavMenuButton, Title, Header as USWDSHeader } from '@trussworks/react-uswds';
import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router';
import { styled, useTheme } from 'styled-components';
// import UserInfo from '@/components/UserInfo';

const UserInfoContainer = styled.div`
  display: none;
  padding-top: 1rem;
  padding-bottom: 1rem;

  @media (width >= 1024px) {
    display: block;
  }

  * {
    color: ${(props) => props.theme?.colors?.primary};

    &:hover,
    &:active {
      color: ${(props) => props.theme?.colors?.primary};
    }
  }
`;

const StyledMenu = styled.div`
  margin: 12px 12px 0 0;

  * {
    color: ${(props) => props.theme?.colors?.text.baseLightest};
  }

  @media (width >= 1024px) {
    display: none;
  }
`;

const TitleSpan = styled.span`
  color: ${(props) => props.theme?.colors?.text.baseDarkest};
  font-size: 2rem !important;
  font-weight: 900 !important;
  margin-top: 2px;
  text-transform: uppercase;

  @media (width >= 1024px) {
    margin-bottom: -4px;
  }
`;

const SubtitleSpan = styled.span`
  color: ${(props) => props.theme?.colors?.text.baseAccent};
  text-transform: uppercase;
  font-weight: 900 !important;
  letter-spacing: 1.5px;
  font-size: 0.8rem;
`;

const StyledTitle = styled(Title)`
  margin: 0;
  padding: 7px 0;
`;

const StyledUSWDSHeader = styled(USWDSHeader)`
  border-bottom: 1px solid ${(props) => props.theme?.colors?.bg.baseLight};

  @media (width >= 1024px) {
    display: block;
  }

  .usa-menu-btn {
    display: none;
  }
`;

const StyledImg = styled.img`
  max-width: 300px;

  @media (width <= 1023px) {
    margin-left: 10px;
    width: 200px;
  }
`;

const StyledContainer = styled.div`
  z-index: 2;
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme?.colors?.text.baseLightest} !important;
`;

const StyledNavbar = styled.div`
  border: 0;
`;

const Header = () => {
    const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
    const theme = useTheme();

    return (
        <StyledContainer>
            <GovBanner tld=".gov" language={'english'} />
            <StyledUSWDSHeader basic={true}>
                <div className="usa-nav-container grid-col-fill display-flex">
                    <StyledNavbar className="usa-navbar">
                        <StyledTitle>
                            <StyledLink to="/" key="nav_link_home" className="display-flex flex-align-center">
                                <span className="margin-right-1">
                                    {
                                        <StyledImg
                                            className="width-100 desktop:width-100 text-bottom margin-right-05"
                                            src={`/DOW-Logo.png`}
                                            alt="Site logo"
                                        />
                                    }
                                </span>
                                {/* <Grid col className="margin-top-neg-2px">
                                    <Grid row>
                                        <TitleSpan className="font-ui-sm flex-fill text-light">Title</TitleSpan>
                                    </Grid>
                                    <Grid row>
                                        <SubtitleSpan className="text-light">Subtitle</SubtitleSpan>
                                    </Grid>
                                </Grid> */}
                            </StyledLink>
                        </StyledTitle>
                        <NavMenuButton label={'Menu'} />
                    </StyledNavbar>
                    <div className="usa-navbar__secondary margin-left-auto margin-bottom-2px">
                        {/* <UserInfoContainer>
                            <UserInfo />
                        </UserInfoContainer> */}
                        <StyledMenu>
                            <Button type="button" title="toggle menu" unstyled>
                                <svg
                                    className="usa-icon"
                                    aria-hidden="true"
                                    focusable="false"
                                    role="img"
                                    aria-label="person"
                                    style={{ margin: '-2px 2px -2px 2px', height: 30, width: 30, fill: theme.colors.primaryDark }}
                                >
                                    <use href="/sprite.svg#menu"></use>
                                </svg>
                            </Button>
                        </StyledMenu>
                    </div>
                </div>
            </StyledUSWDSHeader>
        </StyledContainer>
    );
};

export default Header;
