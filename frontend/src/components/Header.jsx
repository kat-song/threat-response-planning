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

const ThemeToggle = styled.button`
  position: relative;
  width: 52px;
  height: 28px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: ${(props) =>
        props.$isDark
            ? props.theme?.colors?.primary
            : props.theme?.colors?.bg.baseLight};
  transition: background 200ms ease;

  display: inline-flex;
  align-items: center;
  padding: 3px;

  &:focus {
    outline: 2px solid ${(props) => props.theme?.colors?.primary};
    outline-offset: 2px;
  }
`;

const ToggleThumb = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${(props) => props.theme?.colors?.bg.baseLightest};
  transition: transform 200ms ease;

  transform: ${(props) =>
        props.$isDark ? 'translateX(24px)' : 'translateX(0)'};
`;


const Header = () => {
    const theme = useTheme();
    const { themeName, toggleTheme } = useThemeContext();
    const isDark = themeName === 'dark';

    return (
        <StyledContainer $isDark={isDark}>
            <GovBanner tld=".gov" language={'english'} />
            <StyledUSWDSHeader basic={true} $isDark={isDark}>
                <div className="usa-nav-container grid-col-fill display-flex">
                    <StyledNavbar className="usa-navbar">
                        <StyledTitle>
                            <StyledLink to="/" key="nav_link_home" className="display-flex flex-align-center">
                                <span>TORPedo</span>
                            </StyledLink>
                        </StyledTitle>
                        <NavMenuButton label={'Menu'} />
                    </StyledNavbar>
                    <div className="usa-navbar__secondary margin-left-auto margin-bottom-2px display-flex flex-align-center">
                        <UserInfoContainer>
                            <ThemeToggle
                                type="button"
                                onClick={toggleTheme}
                                $isDark={isDark}
                                aria-label="Toggle dark mode"
                            >
                                <ToggleThumb $isDark={isDark} />
                            </ThemeToggle>
                            <span className="usa-sr-only">
                                {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            </span>


                        </UserInfoContainer>
                        <StyledMenu className="display-flex flex-align-center">
                            <ThemeToggle
                                type="button"
                                onClick={toggleTheme}
                                $isDark={isDark}
                                aria-label="Toggle dark mode"
                            >
                                <ToggleThumb $isDark={isDark} />
                            </ThemeToggle>
                            <span className="usa-sr-only">
                                {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            </span>


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
