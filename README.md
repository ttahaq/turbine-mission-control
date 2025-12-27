# Archimedes Screw: Interactive Engineering Simulation

An interactive web-based simulation game designed to demonstrate real-world engineering trade-offs (Efficiency vs. Cost vs. Ecological Impact).

Developed as a gamified presentation tool, this project allows an audience to connect via their smartphones, assume conflicting stakeholder roles, and negotiate design parameters for an Archimedes Screw turbine in real-time.

##  The Concept

Engineering is not just about math; it's about compromise. In this simulation, the user (Presenter) acts as the **Project Lead**, while the audience acts as the **Board of Directors**.

The goal is to design a turbine that:
1.  **Maximizes Efficiency** (Physics constraint)
2.  **Minimizes Cost** (Budget constraint)
3.  **Protects Wildlife** (Ecological constraint)

Achieving all three simultaneously is mathematically difficult, forcing the group to debate and sacrifice one metric for another.

##  Interface Preview

**1. Mission Control (Landing Page)**
*The entry point where the Host (Presenter) and Crew (Audience) select their interfaces.*
![Landing Page](images/landing.png)

**2. The Host Dashboard (Project Lead View)**
*Real-time visualization where the presenter adjusts parameters. Notice the "Eco-Score" and "Efficiency" metrics reacting instantly.*
![Dashboard](images/dashboard.png)

**3. The Field Manual (Mobile/Student View)**
*The secret interface for audience members. This is where they receive their conflicting roles (Engineer, Ecologist, etc.) to debate against the host.*
![Mobile Role Selection](images/mobile.png)

##  Features

* **Dual-Interface System:**
    * **Dashboard (Host):** Real-time visualization of the turbine's performance metrics.
    * **Field Manual (Mobile):** A dedicated mobile interface for audience members to receive secret roles and arguments.
* **Role-Playing Mechanics:** Assigns 5 distinct roles to the audience (Engineer, Finance, Ecologist, Maintenance, and Imposters).
* **Real-Time Feedback:** Instant calculation of "Eco-Score", "Efficiency", and "Estimated Cost" based on 4 adjustable parameters.
* **"God Mode" Mechanic:** A hidden developer override key ,which is X, to force a successful outcome during the final presentation, regardless of the mathematical inputs (Presentation Fail-Safe).

##  Tech Stack

* **Frontend:** React (Vite)
* **Styling:** CSS3 (Custom Dark/Neon UI)
* **Logic:** Custom algorithm for hydraulic efficiency and ecological impact scoring.

##  The Roles

1.  **Chief Engineer:** Pushes for steep angles (34°) to maximize power output.
2.  **Financial Officer:** Pushes for smaller diameters and cheaper materials to save budget.
3.  **Ecologist:** Demands wide spacing (Pitch Ratio > 1.4) to allow fish passage.
4.  **Maintenance Chief:** Worries about mechanical wear and blockages (Radius Ratio).
5.  **The Imposters:** Hidden saboteurs given false data to confuse the debate and cause failure.

##  Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/archimedes-screw-sim.git](https://github.com/yourusername/archimedes-screw-sim.git)
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Run the development server**
    ```bash
    npm run dev
    ```

## Presenter's Secrets

* **The Fail State:** By default, the simulation is rigged to be extremely difficult ("Impossible Mode"), often resulting in low efficiency or high environmental damage to spark debate.
* **God Mode:** Pressing the **'X'** key on the host dashboard activates a hidden override. This guarantees a "MISSION SUCCESS" state with optimal values, allowing the presenter to conclude the talk on a high note.


##  Reference & Research

This simulation logic is strictly based on the mathematical models and experimental data presented in:

> **Design of Archimedes screw turbine: exploring the influence of pitch ratio, radius ratio, and inclination angle on outer diameter size**
> *Authors: Ahmad Indra Siswantara, M. Hilman Gumelar Syafei, Muhammad Arif Budiyanto, Candra Damis Widiawaty, Adi Syuriadi & Tanwir Ahmad Farhan*
> *Published in: Cogent Engineering, Vol. 11, No. 1 (2024)*
>  [Read the Paper / DOI: 10.1080/23311916.2024.2389685](https://doi.org/10.1080/23311916.2024.2389685)

---
*Developed by TugrulTaha - 2025*
