import { Button, GovBanner, NavMenuButton, Title, Header as USWDSHeader } from '@trussworks/react-uswds';
import { Link } from 'react-router';
import { styled, useTheme } from 'styled-components';
import { useThemeContext } from '../context/Theme';

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
  background-color: ${(props) =>
    props.$isDark ? props.theme?.colors?.bg.baseDarkest : props.theme?.colors?.bg.baseDarker};
  transition: background-color 200ms ease, border-color 200ms ease;

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
  background-color: ${(props) =>
    props.$isDark ? props.theme?.colors?.bg.baseDarkest : props.theme?.colors?.bg.baseDarker};
  transition: background-color 200ms ease;
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme?.colors?.text.baseLightest} !important;
`;

const StyledNavbar = styled.div`
  border: 0;
`;

const ToggleButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  border: 1px solid ${(props) => props.theme?.colors?.bg.base};
  background: ${(props) => props.theme?.colors?.bg.baseLightest};
  color: ${(props) => props.theme?.colors?.text.baseDarkest};
  font-size: 0.85rem;
  line-height: 1.1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme?.colors?.primaryLightest};
    border-color: ${(props) => props.theme?.colors?.primary};
  }
`;

const ToggleDot = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) =>
    props.$isDark ? props.theme?.colors?.primary : props.theme?.colors?.bg.base};
  border: 1px solid ${(props) => props.theme?.colors?.primaryDark};
`;

const Header = () => {
    const theme = useTheme();
    const { themeName, toggleTheme } = useThemeContext();
    const isDark = themeName === 'dark';
    const logoSrc = isDark ? '/DOW-Logo-Dark.png' : '/DOW-Logo-Light.png';

    return (
        <StyledContainer $isDark={isDark}>
            <GovBanner tld=".gov" language={'english'} />
            <StyledUSWDSHeader basic={true} $isDark={isDark}>
                <div className="usa-nav-container grid-col-fill display-flex">
                    <StyledNavbar className="usa-navbar">
                        <StyledTitle>
                            <StyledLink to="/" key="nav_link_home" className="display-flex flex-align-center">
                                <span className="margin-right-1">
                                    {
                                        <StyledImg
                                            className="width-100 desktop:width-100 text-bottom margin-right-05"
                                            src={logoSrc}
                                            alt="Department of Workforce logo"
                                        />
                                    }
                                </span>
                            </StyledLink>
                        </StyledTitle>
                        <NavMenuButton label={'Menu'} />
                    </StyledNavbar>
                    <div className="usa-navbar__secondary margin-left-auto margin-bottom-2px display-flex flex-align-center">
                        <UserInfoContainer>
                            <ToggleButton type="button" unstyled onClick={toggleTheme} aria-label="Toggle color theme">
                                <ToggleDot $isDark={isDark} />
                                <span>{isDark ? 'Dark' : 'Light'} mode</span>
                            </ToggleButton>
                        </UserInfoContainer>
                        <StyledMenu className="display-flex flex-align-center">
                            <ToggleButton
                                type="button"
                                unstyled
                                onClick={toggleTheme}
                                aria-label="Toggle color theme (mobile)"
                                style={{ marginRight: 8 }}
                            >
                                <ToggleDot $isDark={isDark} />
                                <span>{isDark ? 'Dark' : 'Light'}</span>
                            </ToggleButton>
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
