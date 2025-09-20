import Header from "../../components/Header";
import Background from "../../components/Background";
import Footer from "../../components/Footer";

export default function RegisterPage() {
  return (
    <>
      <Header />
      <Background />
      <main style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1rem",
        color: "#fff",
        textAlign: "center",
      }}>
        <div>
          <h1 style={{ fontSize: "2.25rem", marginBottom: "0.75rem" }}>Register</h1>
          <p style={{ opacity: 0.9 }}>
            Registration page placeholder. We’ll add the actual form and link this page from the site.
          </p>
        </div>
      </main>
      <Footer isNotRegisterPage={false} />
    </>
  );
}
