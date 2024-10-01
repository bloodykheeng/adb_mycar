import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input
} from "reactstrap";
import { Logout } from "@mui/icons-material";
import routes from "routes.js";
import mainroutes from "main_routes";
import GetUser from "components/auth/GetUser";
import useAuthContext from "../../context/AuthContext";
import styled from "styled-components"; // Import styled-components

import { logout } from "services/auth/auth-api";

function Header(props) {
  const { getUserQuery } = useAuthContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = React.useState(false);
  const [color, setColor] = React.useState("transparent");
  const sidebarToggle = React.useRef();
  const location = useLocation();
  const [user, setUser] = useState();
  const toggle = () => {
    if (isOpen) {
      setColor("transparent");
    } else {
      setColor("dark");
    }
    setIsOpen(!isOpen);
  };
  const dropdownToggle = (e) => {
    setDropdownOpen(!dropdownOpen);
  };

  const settingsDropdownToggle = (e) => {
    setSettingsDropdownOpen(!settingsDropdownOpen);
  };

  // const getBrand = () => {
  //   let brandName = "Default Brand";
  //   routes.map((prop, key) => {
  //     if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
  //       brandName = prop.name;
  //     }
  //     return null;
  //   });
  //   return brandName;
  // };

  const getBrand = () => {
    let brandName = "Ministry of Water And Environment Web Based M & E System";
    mainroutes().map((prop, key) => {
      if (window.location.href.indexOf(prop.path) !== -1) {
        brandName = prop.name;
      }
      return null;
    });
    return brandName;
  };
  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };
  // function that adds color dark/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && isOpen) {
      setColor("dark");
    } else {
      setColor("transparent");
    }
  };
  React.useEffect(() => {
    window.addEventListener("resize", updateColor.bind(this));
  });
  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);

  let navigate = useNavigate();

  const { logoutMutation } = useAuthContext();

  const handlelogout = async () => {
    try {
      await logoutMutation.mutate();
    } catch (e) {
      console.log(e);
    }
  };

  //

  // Define a styled NavbarBrand component with responsive font size
  const StyledNavbarBrand = styled(NavbarBrand)`
    font-size: 24px !important; /* Default font size */
    text-transform: none !important;

    @media (min-width: 600px) {
      font-size: 16px !important; /* Responsive font size */
      padding-left: 1rem !important;
    }

    @media (min-width: 400px) and (max-width: 600px) {
      font-size: 10px !important; /* Responsive font size */
      padding-left: 1rem !important;
    }

    @media (max-width: 400px) {
      font-size: 7px !important; /* Responsive font size */
      padding-left: 1rem !important;
    }
  `;

  const CustomNavbarToggler = styled(NavbarToggler)`
    border: none !important;
    outline: none !important;
  `;

  const CustomNavbarToggle = styled.div`
    .navbar-toggler {
      border: none !important;
      outline: none !important;
      display: flex;
      align-items: center;
      justify-content: center;
      // Add other styles here
    }
  `;

  //
  return (
    // add or remove classes depending if we are on full-screen-maps page or not
    <Navbar
      color={
        location.pathname.indexOf("full-screen-maps") !== -1 ? "dark" : color
      }
      expand="lg"
      className={
        location.pathname.indexOf("full-screen-maps") !== -1
          ? "navbar-absolute fixed-top"
          : "navbar-absolute fixed-top " +
            (color === "transparent" ? "navbar-transparent " : "")
      }
    >
      <Container fluid>
        <div className="navbar-wrapper">
          <CustomNavbarToggle className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={() => openSidebar()}
            >
              <center>
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </center>
            </button>
          </CustomNavbarToggle>

          <StyledNavbarBrand href="/dashboard">{getBrand()}</StyledNavbarBrand>
          {/* <NavbarBrand
            href="/dashboard"
            
          >
            {getBrand()}
          </NavbarBrand> */}
        </div>
        <CustomNavbarToggler onClick={toggle}>
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </CustomNavbarToggler>
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
          {/* <form>
            <InputGroup className="no-border">
              <Input placeholder="Search..." />
              <InputGroupAddon addonType="append">
                <InputGroupText>
                  <i className="nc-icon nc-zoom-split" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </form> */}
          <Nav navbar>
            {/* <NavItem>
              <Link to="#" className="nav-link btn-magnify">
                <i className="nc-icon nc-layout-11" />
                <p>
                  <span className="d-lg-none d-md-block">Stats</span>
                </p>
              </Link>
            </NavItem> */}
            {/* <Dropdown
              nav
              isOpen={dropdownOpen}
              toggle={(e) => dropdownToggle(e)}
            >
              <DropdownToggle caret nav>
                <i className="nc-icon nc-bell-55" />
                <p>
                  <span className="d-lg-none d-md-block">Some Actions</span>
                </p>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem tag="a">Action</DropdownItem>
                <DropdownItem tag="a">Another Action</DropdownItem>
                <DropdownItem tag="a">Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown> */}
            <Dropdown
              nav
              isOpen={settingsDropdownOpen}
              toggle={(e) => settingsDropdownToggle(e)}
            >
              <DropdownToggle caret nav>
                <i className="nc-icon nc-settings-gear-65" />
                <p>
                  <span className="d-lg-none d-md-block">Settings</span>
                </p>
              </DropdownToggle>
              <DropdownMenu right positionFixed={true} style={{ width: "40%" }}>
                <DropdownItem tag="small">
                  User Name :{" "}
                  {getUserQuery?.data?.data?.username
                    ? getUserQuery?.data?.data?.username
                    : "N/A"}
                </DropdownItem>

                <DropdownItem tag="small">
                  Role :{" "}
                  {getUserQuery?.data?.data?.role
                    ? getUserQuery?.data?.data?.role
                    : "N/A"}
                </DropdownItem>
                <DropdownItem tag="small">
                  Department :{" "}
                  {getUserQuery?.data?.data?.department
                    ? getUserQuery?.data?.data?.department
                    : "N/A"}
                </DropdownItem>
                {(getUserQuery?.data?.data?.role == "Manager" ||
                  getUserQuery?.data?.data?.role == "Supervisor" ||
                  getUserQuery?.data?.data?.role == "Standard User") && (
                  <DropdownItem tag="small">
                    Project :{" "}
                    {getUserQuery?.data?.data?.project?.name
                      ? getUserQuery?.data?.data?.project?.name
                      : "N/A"}
                  </DropdownItem>
                )}

                {logoutMutation.isLoading ? (
                  <DropdownItem>Exiting...</DropdownItem>
                ) : (
                  <DropdownItem tag="a" onClick={handlelogout}>
                    Logout
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
            {/* <NavItem>
              <Link to="#" className="nav-link btn-rotate">
                <i className="nc-icon nc-settings-gear-65" />
                <p>
                  <span className="d-lg-none d-md-block">Account</span>
                </p>
              </Link>
            </NavItem> */}
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
