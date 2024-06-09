import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function CustomNavBar() {
  /* The logout endpoint was not ready, it keeps returning 500 Internal Server Error. Thus, this was commented. */
  // const [isLogingOut, setIsLoggingOut] = useState(false);
  // const isLoggedIn = useMemo(() => Cookies.get("access_token"), []);
  // const handleLogout = () => {
  //   if (isLogingOut) return;
  //   setIsLoggingOut(true);
  //   fetch(baseUrl + "api/logout", { method: "POST" }).then(r => r.json())
  //     .then(() => {
  //       Cookies.remove("access_token");
  //       Cookies.remove("mosnad_user");
  //       window.location.href = "/login/";
  //     }).catch(console.log)
  //     .finally(() => setIsLoggingOut(false))
  // }

  return (
    <Navbar expand="lg" className="bg-body-tertiary" style={{ textAlign: "center" }}>
      <Container>
        <Navbar.Brand href="/">Ask Anywhere</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/tickets/add/">Add Ticket</Nav.Link>
            {/* {isLoggedIn ?
              <Nav.Link onClick={handleLogout}>{isLogingOut ? "..." : "Logout"}</Nav.Link>
              : */}
              <Nav.Link href="/login/">Login</Nav.Link>
            {/* } */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavBar;