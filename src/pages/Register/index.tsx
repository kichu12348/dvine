import { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/Header";
import Background from "../../components/Background";
import Footer from "../../components/Footer";
import styles from "./Register.module.css";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

type Gender = "male" | "female" | "";

type Member = {
  name: string;
  email: string;
  phone: string;
  gender: Gender;
};

type Option<T = string | number> = {
  label: string;
  value: T;
};

function useOutsideClick(
  ref: React.RefObject<HTMLElement>,
  onOutside: () => void
) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onOutside]);
}

function CustomDropdown<T extends string | number>({
  label,
  options,
  value,
  onChange,
  placeholder,
  className,
}: {
  label?: string;
  options: Option<T>[];
  value: T | undefined;
  onChange: (v: T) => void;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useMemo(() => ({ current: null as unknown as HTMLElement }), []);
  useOutsideClick(ref as unknown as React.RefObject<HTMLElement>, () =>
    setOpen(false)
  );

  const selected = options.find((o) => o.value === value);

  return (
    <div className={`${styles.dropdown} ${className ?? ""}`} ref={ref as any}>
      {label && <label className={styles.label}>{label}</label>}
      <button
        type="button"
        className={styles.dropdownButton}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{selected ? selected.label : placeholder ?? "Select"}</span>
        <span className={styles.chevron} aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <ul className={styles.dropdownList} role="listbox">
          {options.map((opt) => (
            <li key={String(opt.value)} role="option">
              <button
                type="button"
                className={`${styles.dropdownItem} ${
                  opt.value === value ? styles.dropdownItemActive : ""
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const [teamName, setTeamName] = useState("");
  const [count, setCount] = useState<1 | 2>(1);
  const [members, setMembers] = useState<Member[]>([
    { name: "", email: "", phone: "", gender: "" },
  ]);
  const [transactionId, setTransactionId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [college, setCollege] = useState("");
  const [userUpiId, setUserUpiId] = useState("");
  const upiId = "sanjeevsnair1412@okicici";

  const [registrationsClosed, setRegistrationsClosed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const response = await axios.get("/total-registrations");
        if (response.status !== 200) {
          throw new Error("Could not fetch registration count.");
        }
        const data = response.data as { count: number };
        // Close registration if count is 40 or more
        if (data.count >= 40) {
          setRegistrationsClosed(true);
        }
      } catch (err) {
        console.error(err);
        // Display an error if the API call fails
        setError(
          "Could not verify registration status. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkRegistrationStatus();
  }, []);

  useEffect(() => {
    setMembers((prev) => {
      if (count === 1) return prev.slice(0, 1);
      if (prev.length === 2) return prev;
      return [...prev, { name: "", email: "", phone: "", gender: "" }];
    });
  }, [count]);

  const memberOptions: Option<1 | 2>[] = [
    { label: "Individual", value: 1 },
    { label: "2", value: 2 },
  ];

  const genderOptions: Option<Gender>[] = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  function updateMember(idx: number, patch: Partial<Member>) {
    setMembers((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, ...patch } : m))
    );
  }

  function sanitizePhoneInput(value: string) {
    // Keep digits only; cap to 10 digits for Indian numbers
    return value.replace(/\D/g, "").slice(0, 10);
  }

  function onScreenshotChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setScreenshotFile(null);
      setScreenshotPreview(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      setScreenshotFile(null);
      setScreenshotPreview(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      setScreenshotFile(null);
      setScreenshotPreview(null);
      return;
    }
    setError(null);
    setScreenshotFile(file);
    const url = URL.createObjectURL(file);
    setScreenshotPreview(url);
  }

  function onOpenFileDialog() {
    fileInputRef.current?.click();
  }

  function clearScreenshot() {
    if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
    setScreenshotFile(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  useEffect(() => {
    return () => {
      if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
    };
  }, [screenshotPreview]);

  function validate(): string | null {
    if (!college.trim()) return "Please enter your college name.";
    if (!teamName.trim()) return "Please enter a team name.";
    if (!userUpiId.trim()) return "Please enter your UPI ID.";
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name.trim() || !m.email.trim() || !m.phone.trim()) {
        return `Please fill all required fields for member ${i + 1}.`;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email)) {
        return `Please enter a valid email for member ${i + 1}.`;
      }
      if (!/^\d{10}$/.test(m.phone)) {
        return `Phone for member ${i + 1} must be 10 digits.`;
      }
      if (m.gender !== "male" && m.gender !== "female") {
        return `Please select gender for member ${i + 1}.`;
      }
    }
    if (!transactionId.trim() && !screenshotFile) {
      return "Please provide either a transaction ID or upload a payment screenshot.";
    }
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (registrationsClosed) {
      setError("Registrations are currently closed.");
      return;
    }

    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSubmitting(true);

    try {
      const apiFormData = new FormData();

      // Append main team details
      apiFormData.append("teamName", teamName);
      apiFormData.append("teamSize", String(count));
      apiFormData.append("college", college);
      apiFormData.append("upiId", userUpiId);

      // Append payment details
      apiFormData.append("transactionId", transactionId);
      if (screenshotFile) {
        apiFormData.append("paymentScreenshot", screenshotFile);
      }

      // Append each member's data in a format the backend can parse
      members.forEach((member, index) => {
        apiFormData.append(`users[${index}][name]`, member.name);
        apiFormData.append(`users[${index}][email]`, member.email);
        // The backend expects the full phone number with country code
        apiFormData.append(`users[${index}][phone]`, `+91${member.phone}`);
        apiFormData.append(`users[${index}][gender]`, member.gender);
      });

      // Make the API call to the backend
      const response = await axios.post("/register", apiFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = (await response.data) as {
        success: boolean;
        error?: string;
      };

      if (!result.success) {
        // Use the error message from the backend if available
        throw new Error(
          result.error || "Registration failed. Please try again."
        );
      }

      setSuccess(
        "Registration successful! We will verify your payment and get in touch soon."
      );
      // Optionally reset the form here
    } catch (err: any) {
      setError(err.response.data.error || err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header isNotRegisterPage={false} />
      <Background />
      <main className={styles.main}>
        <section className={styles.card}>
          <h1 className={styles.title}>Team Registration</h1>
          <p className={styles.subtitle}>
            Register as an individual or a team of two.
          </p>

          {isLoading ? (
            <p>Checking registration status...</p>
          ) : registrationsClosed ? (
            <div className={styles.error}>
              <h3 style={{
                fontFamily:"var(--font-body)"
              }}>Registrations Closed</h3>
              <p>
                We have reached the maximum number of registrations. Thank you
                for your interest!
              </p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label htmlFor="teamName" className={styles.label}>
                    Team Name
                  </label>
                  <input
                    id="teamName"
                    className={styles.input}
                    type="text"
                    placeholder="Enter your team name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="college" className={styles.label}>
                    College / Institution
                  </label>
                  <input
                    id="college"
                    className={styles.input}
                    type="text"
                    placeholder="Enter your college name"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    required
                  />
                </div>

                <CustomDropdown<1 | 2>
                  label="Number of Members"
                  options={memberOptions}
                  value={count}
                  onChange={(v) => setCount(v)}
                  placeholder="Select count"
                  className={styles.field}
                />
              </div>

              <div className={styles.membersWrapper}>
                {members.map((m, idx) => (
                  <div key={idx} className={styles.memberCard}>
                    <h3 className={styles.memberTitle}>Member {idx + 1}</h3>
                    <div className={styles.memberGrid}>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor={`name-${idx}`}>
                          Name
                        </label>
                        <input
                          id={`name-${idx}`}
                          className={styles.input}
                          type="text"
                          placeholder="Full name"
                          value={m.name}
                          onChange={(e) =>
                            updateMember(idx, { name: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className={styles.field}>
                        <label
                          className={styles.label}
                          htmlFor={`email-${idx}`}
                        >
                          Email
                        </label>
                        <input
                          id={`email-${idx}`}
                          className={styles.input}
                          type="email"
                          placeholder="name@example.com"
                          value={m.email}
                          onChange={(e) =>
                            updateMember(idx, { email: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className={styles.field}>
                        <label
                          className={styles.label}
                          htmlFor={`phone-${idx}`}
                        >
                          Phone (+91)
                        </label>
                        <div className={styles.phoneGroup}>
                          <span className={styles.phonePrefix}>+91</span>
                          <input
                            id={`phone-${idx}`}
                            className={`${styles.input} ${styles.phoneInput}`}
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="10-digit number"
                            value={m.phone}
                            onChange={(e) =>
                              updateMember(idx, {
                                phone: sanitizePhoneInput(e.target.value),
                              })
                            }
                            required
                            title="Enter 10-digit Indian mobile number"
                          />
                        </div>
                      </div>

                      <CustomDropdown<Gender>
                        label="Gender"
                        options={genderOptions}
                        value={m.gender}
                        onChange={(v) => updateMember(idx, { gender: v })}
                        placeholder="Select gender"
                        className={styles.field}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <section className={styles.paymentSection}>
                <h3 className={styles.paymentTitle}>Payment</h3>
                <p className={styles.feeNotice}>
                  Registration Fee: ₹{members.length * 250}
                </p>
                <div className={styles.upiBlock}>
                  <div className={styles.qrWrap}>
                    <img
                      src="/qr/qr.webp"
                      alt="UPI QR code"
                      className={styles.qrImg}
                    />
                  </div>
                  <div className={styles.upiInfo}>
                    <div
                      className={styles.upiRow}
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(upiId);
                          setSuccess("UPI ID copied to clipboard");
                        } catch {
                          setError("Failed to copy UPI ID");
                        }
                      }}
                    >
                      <span className={styles.upiValue}>{upiId}</span>
                    </div>
                    <span className={styles.helper}>
                      Scan the QR or pay to the UPI ID above, then provide
                      either the transaction ID OR upload a payment screenshot
                      below.
                    </span>
                  </div>
                </div>
                <div className={styles.paymentGrid}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="userUpiId">
                      Your UPI ID (used for payment)
                    </label>
                    <input
                      id="userUpiId"
                      className={styles.input}
                      type="text"
                      placeholder="yourname@oksbi"
                      value={userUpiId}
                      onChange={(e) => setUserUpiId(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="transactionId">
                      Transaction ID (Optional if screenshot provided)
                    </label>
                    <input
                      id="transactionId"
                      className={styles.input}
                      type="text"
                      placeholder="Enter transaction/reference ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      required={!screenshotFile}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="screenshot">
                      Payment Screenshot (Optional if transaction ID provided)
                    </label>
                    <div className={styles.fileInputWrap}>
                      <input
                        id="screenshot"
                        ref={fileInputRef}
                        className={styles.visuallyHidden}
                        type="file"
                        accept="image/*"
                        onChange={onScreenshotChange}
                        aria-describedby="screenshotHelp"
                        required={!transactionId.trim()}
                      />
                      <div className={styles.filePicker}>
                        <button
                          type="button"
                          className={styles.fileButton}
                          onClick={onOpenFileDialog}
                        >
                          {screenshotFile ? "Change image" : "Select image"}
                        </button>
                        <span className={styles.fileName}>
                          {screenshotFile
                            ? screenshotFile.name
                            : "No file selected"}
                        </span>
                        {screenshotFile && (
                          <button
                            type="button"
                            className={styles.fileRemove}
                            onClick={clearScreenshot}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                    {screenshotPreview && (
                      <div className={styles.previewBox}>
                        <img
                          src={screenshotPreview}
                          alt="Payment screenshot preview"
                          className={styles.previewImg}
                        />
                      </div>
                    )}
                    <span className={styles.helper}>
                      Accepted: image files up to 5MB. Provide either this OR
                      transaction ID above.
                    </span>
                  </div>
                </div>
              </section>

              {error && <div className={styles.error}>{error}</div>}
              {success && <div className={styles.success}>{success}</div>}

              <div className={styles.actions}>
                <button
                  className={styles.submit}
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
      <Footer isNotRegisterPage={false} />
    </>
  );
}
