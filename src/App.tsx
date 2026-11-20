import Admin from './Admin';
import { ProjectFiles } from './components/ProjectFiles';
import { requireSupabase } from './lib-supabase';
import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Command,
  Cpu,
  GitBranch,
  Github,
  KeyRound,
  Layers3,
  LockKeyhole,
  Menu,
  Play,
  Plus,
  Radio,
  RotateCcw,
  Server,
  ShieldCheck,
  Square,
  TerminalSquare,
  Trash2,
  Webhook,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import { LogViewer } from './components/LogViewer';
import { StatusIndicator, formatDuration } from './components/StatusIndicator';
import { JobStep, LogEntry, JobStatus } from './types/pipeline';

type Page =
  | 'home'
  | 'login'
  | 'signup'
  | 'docs'
  | 'pricing'
  | 'admin'
  | 'admin/login'
  | 'overview'
  | 'pipelines'
  | 'runs'
  | 'deployments'
  | 'compute'
  | 'sandboxes'
  | 'projects'
  | 'artifacts'
  | 'settings';

const nav: { id: Page; label: string; icon: any; group: string }[] = [
  { id: 'overview', label: 'Overview', icon: Activity, group: 'WORKSPACE' },
  { id: 'pipelines', label: 'Pipelines', icon: Workflow, group: 'WORKSPACE' },
  { id: 'runs', label: 'Run history', icon: Clock3, group: 'WORKSPACE' },
  { id: 'deployments', label: 'Deployments', icon: Server, group: 'WORKSPACE' },
  { id: 'projects', label: 'Projects', icon: Layers3, group: 'WORKSPACE' },
  { id: 'artifacts', label: 'Artifacts', icon: Boxes, group: 'WORKSPACE' },
  { id: 'settings', label: 'Settings', icon: Command, group: 'MANAGE' },
];

function go(p: Page) {
  history.pushState({}, '', p === 'home' ? '/' : `/${p}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <button className={`brand ${light ? 'brand-light' : ''}`} onClick={() => go('home')}>
      <span className="brand-mark">
        <span />
      </span>
      <span>
        kestrel<span className="brand-dot">.</span>
      </span>
    </button>
  );
}

function Button({ children, onClick, kind = 'dark', disabled = false, type = 'button' }: any) {
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`btn btn-${kind}`}>
      {children}
    </button>
  );
}

function Landing() {
  return (
    <div className="marketing">
      <header className="marketing-nav wrap">
        <Brand />
        <nav>
          <a href="#platform">Platform</a>
          <a href="#workflow">How it works</a>
          <button onClick={() => go('docs')}>Documentation</button>
          <button onClick={() => go('pricing')}>Pricing</button>
        </nav>
        <div className="nav-actions">
          <button className="login-link" onClick={() => go('login')}>
            Log in
          </button>
          <Button onClick={() => go('signup')}>
            Start building <ArrowUpRight size={15} />
          </Button>
        </div>
      </header>

      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="live-dot" /> DISTRIBUTED DELIVERY INFRASTRUCTURE
          </div>
          <h1>
            Ship with confidence.
            <br />
            <span>Scale without limits.</span>
          </h1>
          <p className="hero-lead">
            A distributed CI/CD platform that turns every commit into a coordinated build, test and deployment
            pipeline — across the machines you control.
          </p>
          <div className="hero-ctas">
            <Button onClick={() => go('signup')}>
              Get started free <ArrowRight size={16} />
            </Button>
            <button className="text-cta" onClick={() => go('docs')}>
              Read the documentation <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="hero-proof">
            <div className="proof-avatars">
              <i>K</i>
              <i>CI</i>
              <i>+</i>
            </div>
            <span>Built for teams that ship software</span>
            <span className="proof-sep">·</span>
            <span>Self-hosted workers</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-top">
            <span>
              EXAMPLE PIPELINE
            </span>
            <span>sample-run</span>
          </div>
          <div className="visual-title">
            <div>
              <small>sample project / example environment</small>
              <h3>Deploy pipeline</h3>
            </div>
            <span className="pill pill-muted">Example</span>
          </div>
          <div className="pipeline-track">
            <div className="track-line" />
            <div className="stage done">
              <span>
                <Check />
              </span>
              <b>Checkout</b>
              <small>0.8s</small>
            </div>
            <div className="stage done">
              <span>
                <Check />
              </span>
              <b>Install</b>
              <small>12.4s</small>
            </div>
            <div className="stage active">
              <span>
                <Radio />
              </span>
              <b>Test suite</b>
              <small>Example worker</small>
            </div>
            <div className="stage waiting">
              <span>4</span>
              <b>Deploy</b>
              <small>Waiting</small>
            </div>
          </div>
          <div className="visual-divider" />
          <div className="worker-strip">
            <div>
              <Server />
              <span>
                <b>sample-worker</b>
                <small>Example runner · Linux</small>
              </span>
            </div>
            <div className="worker-state">
              SAMPLE STATE
            </div>
          </div>
          <div className="log-lines">
            <p>
              <time>14:32:08</time>
              <span className="log-ok">✓</span> Dependencies installed
            </p>
            <p>
              <time>14:32:11</time>
              <span className="log-ok">✓</span> Type check passed
            </p>
            <p>
              <time>14:32:14</time>
              <span className="log-run">↻</span> Running integration tests...
            </p>
          </div>
          <div className="visual-foot">
            <span>
              ILLUSTRATION ONLY <b>NOT LIVE</b>
            </span>
            <span>NO LIVE WORKER DATA</span>
          </div>
        </div>
      </section>

      <div className="ticker">
        <div className="wrap ticker-inner">
          <span>ONE CONTROL PLANE</span>
          <span>·</span>
          <span>MANY EXECUTION NODES</span>
          <span>·</span>
          <span>YOUR INFRASTRUCTURE</span>
          <span>·</span>
          <span>YOUR DELIVERY PIPELINE</span>
        </div>
      </div>

      <section className="section wrap" id="platform">
        <div className="section-head">
          <div>
            <div className="eyebrow">THE KESTREL PLATFORM</div>
            <h2>
              Everything in the pipeline.
              <br />
              <span>Nothing behind the curtain.</span>
            </h2>
          </div>
          <p>
            One place to orchestrate work. Independent workers to execute it. Full visibility from the first checkout to
            the final deployment.
          </p>
        </div>
        <div className="feature-grid">
          <article className="feature feature-large">
            <div className="feature-icon">
              <Workflow />
            </div>
            <div className="mini-graph">
              <div>
                build <b>✓</b>
              </div>
              <div>
                test <b>↻</b>
              </div>
              <div>
                package <b>·</b>
              </div>
              <div>
                deploy <b>·</b>
              </div>
            </div>
            <h3>Pipeline orchestration</h3>
            <p>Define jobs, dependencies and stages. Kestrel schedules work when its prerequisites are met, not a moment before.</p>
          </article>
          <article className="feature">
            <div className="feature-icon">
              <Server />
            </div>
            <h3>Distributed workers</h3>
            <p>Connect independent execution nodes across machines and environments. Scale capacity without scaling the control plane.</p>
            <div className="feature-metric">
              <b>Worker fleet</b>
              <span>Connect your own workers</span>
            </div>
          </article>
          <article className="feature">
            <div className="feature-icon">
              <TerminalSquare />
            </div>
            <h3>Live execution logs</h3>
            <p>Follow stdout, stderr, job status and exit codes as work happens on the worker.</p>
            <div className="terminal-mini">
              <span>Example command</span>
              <b>Illustrative output</b>
            </div>
          </article>
          <article className="feature">
            <div className="feature-icon">
              <ShieldCheck />
            </div>
            <h3>Operational control</h3>
            <p>Monitor worker health, concurrency and job leases. Keep execution capacity visible and accountable.</p>
          </article>
          <article className="feature">
            <div className="feature-icon">
              <Boxes />
            </div>
            <h3>Build artifacts</h3>
            <p>Keep outputs traceable to the pipeline run that produced them. Build once, promote with confidence.</p>
          </article>
        </div>
      </section>

      <section className="workflow-section" id="workflow">
        <div className="wrap workflow-inner">
          <div>
            <div className="eyebrow">HOW KESTREL WORKS</div>
            <h2>
              One commit.
              <br />
              A coordinated system.
            </h2>
            <p>
              Your control plane coordinates the work. Workers claim eligible jobs, execute commands and report results.
              Dependencies decide what runs next.
            </p>
            <Button onClick={() => go('docs')}>
              Explore the architecture <ArrowRight size={16} />
            </Button>
          </div>
          <div className="flow-steps">
            <div>
              <span>01</span>
              <GitBranch />
              <section>
                <b>Connect a repository</b>
                <small>Register a project and define its pipeline.</small>
              </section>
            </div>
            <div>
              <span>02</span>
              <Workflow />
              <section>
                <b>Schedule the work</b>
                <small>Jobs enter the queue when dependencies allow.</small>
              </section>
            </div>
            <div>
              <span>03</span>
              <Cpu />
              <section>
                <b>Execute across workers</b>
                <small>Available workers claim jobs and stream results.</small>
              </section>
            </div>
            <div>
              <span>04</span>
              <Check />
              <section>
                <b>Review and deploy</b>
                <small>Inspect logs, artifacts and final status.</small>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="bottom-cta wrap">
        <div>
          <div className="eyebrow">READY WHEN YOU ARE</div>
          <h2>Your next release starts here.</h2>
          <p>Bring your repository. Connect your workers. Let Kestrel coordinate the rest.</p>
        </div>
        <Button onClick={() => go('signup')}>
          Create your workspace <ArrowUpRight size={16} />
        </Button>
      </section>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer wrap">
      <Brand />
      <span>© 2026 Kestrel Systems</span>
      <div>
        <button onClick={() => go('docs')}>Documentation</button>
        <button onClick={() => go('pricing')}>Pricing</button>
        <button onClick={() => go('login')}>Sign in</button>
      </div>
    </footer>
  );
}

function Auth({ mode }: { mode: 'login' | 'signup' }) {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e: any) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const sb = requireSupabase();
      if (mode === 'signup') {
        const { data, error } = await sb.auth.signUp({ email, password, options: { data: { full_name: name } } });
        if (error) throw error;
        if (!data.session) {
          setMessage('Check your email to confirm your account, then sign in.');
          return;
        }
        go('overview');
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        go('overview');
      }
    } catch (e: any) {
      setError(e.message || 'Authentication failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <Brand light />
        <div className="auth-aside-copy">
          <div className="eyebrow">DISTRIBUTED CI/CD, UNDER YOUR CONTROL</div>
          <h1>
            Build systems
            <br />
            that <span>move work<br />forward.</span>
          </h1>
          <p>Coordinate pipelines across independent workers. Keep every build visible, every execution traceable.</p>
        </div>
        <div className="auth-aside-bottom">
          <div className="auth-grid-art">
            <span>CONTROL PLANE</span>
            <ArrowDownRight />
            <span>WORKER NODES</span>
            <div className="art-nodes">
              <i />
              <i />
              <i />
            </div>
          </div>
          <small>KESTREL · DELIVERY INFRASTRUCTURE</small>
        </div>
      </aside>
      <main className="auth-main">
        <button className="back-home" onClick={() => go('home')}>
          ← Back to home
        </button>
        <div className="auth-form-wrap">
          <div className="auth-kicker">{mode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}</div>
          <h2>{mode === 'login' ? 'Sign in to Kestrel' : 'Create your workspace'}</h2>
          <p>{mode === 'login' ? 'Continue to your delivery workspace.' : 'Start orchestrating builds across your infrastructure.'}</p>
          <form onSubmit={submit}>
            {mode === 'signup' && (
              <label>
                Full name
                <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" autoComplete="name" />
              </label>
            )}
            <label>
              Work email
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@company.com" autoComplete="email" />
            </label>
            <label>
              Password
              <div className="password-input">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={show ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button type="button" onClick={() => setShow(!show)}>
                  {show ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>
            {mode === 'signup' && (
              <label className="checkline">
                <input type="checkbox" required /> I agree to the terms and privacy policy.
              </label>
            )}
            {error && <div className="notice text-red-600">{error}</div>}
            {message && <div className="notice text-green-600">{message}</div>}
            <button disabled={busy} className="btn btn-dark auth-submit">
              {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={16} />
            </button>
          </form>
          <div className="auth-switch">
            {mode === 'login' ? (
              <>
                New to Kestrel? <button onClick={() => go('signup')}>Create an account</button>
              </>
            ) : (
              <>
                Already have an account? <button onClick={() => go('login')}>Sign in</button>
              </>
            )}
          </div>
          <div className="auth-security">
            <LockKeyhole size={14} /> Authentication powered by Supabase Auth
          </div>
        </div>
        <div className="auth-copyright">
          © 2026 Kestrel Systems <span>·</span> <button onClick={() => go('docs')}>Help centre</button>
        </div>
      </main>
    </div>
  );
}

function AppShell({ page }: { page: Page }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const api = (import.meta.env.VITE_API_BASE_URL as string) || '/api';
  const [accessToken, setAccessToken] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [health, setHealth] = useState('Checking...');
  const [snapshot, setSnapshot] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Project registration state
  const [projectName, setProjectName] = useState('');
  const [projectRepo, setProjectRepo] = useState('');
  const [projectBranch, setProjectBranch] = useState('main');
  const [actionMessage, setActionMessage] = useState('');

  // Run creation state
  const [selectedProject, setSelectedProject] = useState('');
  const [branch, setBranch] = useState('main');
  const [commitMessage, setCommitMessage] = useState('Manual pipeline run');

  // Inspection states
  const [inspectedRunId, setInspectedRunId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobStep | undefined>(undefined);
  const [selectedProjectForSecrets, setSelectedProjectForSecrets] = useState<string | null>(null);
  const [projectSecrets, setProjectSecrets] = useState<{ id: string; name: string; createdAt: string }[]>([]);
  const [newSecretName, setNewSecretName] = useState('');
  const [newSecretValue, setNewSecretValue] = useState('');
  const [webhookConfig, setWebhookConfig] = useState<{ webhookSecret: string; events: string[] } | null>(null);
  const [deploymentEnvironments, setDeploymentEnvironments] = useState<any[]>([]);
  const [deploymentReleases, setDeploymentReleases] = useState<Record<string, any[]>>({});
  const [deploymentName, setDeploymentName] = useState('Production');
  const [deploymentEnvironmentKey, setDeploymentEnvironmentKey] = useState('production');
  const [deploymentWorkerId, setDeploymentWorkerId] = useState('');
  const [deploymentHostPort, setDeploymentHostPort] = useState('8080');
  const [deploymentContainerPort, setDeploymentContainerPort] = useState('3000');
  const [deploymentHealthPath, setDeploymentHealthPath] = useState('/');
  const [deploymentPublicUrl, setDeploymentPublicUrl] = useState('');
  const [deploymentImage, setDeploymentImage] = useState('');
  const [rustWorkerName, setRustWorkerName] = useState('Kestrel Deployment Worker');
  const [rustWorkerRegion, setRustWorkerRegion] = useState('unknown');
  const [rustWorkerConcurrency, setRustWorkerConcurrency] = useState('1');
  const [rustWorkerProvisioning, setRustWorkerProvisioning] = useState(false);
  const [rustWorkerCredential, setRustWorkerCredential] = useState<any>(null);
  const [showRustSetup, setShowRustSetup] = useState(false);

  // Kestrel Compute
  const [computeInstances, setComputeInstances] = useState<any[]>([]);
  const [computeQuota, setComputeQuota] = useState<any>(null);
  const [computeSnapshots, setComputeSnapshots] = useState<Record<string, any[]>>({});
  const [computeProvider, setComputeProvider] = useState('incus');
  const [computeName, setComputeName] = useState('vm-01');
  const [computeImage, setComputeImage] = useState('ubuntu:24.04');
  const [computeVcpus, setComputeVcpus] = useState('2');
  const [computeMemory, setComputeMemory] = useState('2048');
  const [computeDisk, setComputeDisk] = useState('30');
  const [computeRegion, setComputeRegion] = useState('');
  const [computeSshKey, setComputeSshKey] = useState('');
  const [computeMessage, setComputeMessage] = useState('');
  const [computeBusy, setComputeBusy] = useState(false);

  // Managed sandbox compute (Vercel Sandbox)
  const [sandboxInstances, setSandboxInstances] = useState<any[]>([]);
  const [sandboxQuota, setSandboxQuota] = useState<any>(null);
  const [sandboxName, setSandboxName] = useState('devbox');
  const [sandboxVcpus, setSandboxVcpus] = useState('1');
  const [sandboxRegion, setSandboxRegion] = useState('iad1');
  const [sandboxTimeout, setSandboxTimeout] = useState('900');
  const [sandboxBusy, setSandboxBusy] = useState(false);
  const [sandboxMessage, setSandboxMessage] = useState('');
  const [sandboxCommands, setSandboxCommands] = useState<Record<string, string>>({});
  const [sandboxResults, setSandboxResults] = useState<Record<string, any>>({});

  const active = nav.find((n) => n.id === page) || nav[0];

  async function connect() {
    setLoading(true);
    try {
      const sb = requireSupabase();
      const {
        data: { session },
      } = await sb.auth.getSession();
      if (!session) {
        go('login');
        throw new Error('Please sign in first');
      }
      setAccessToken(session.access_token);

      let ws = await fetch(`${api}/workspaces`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!ws.ok) throw new Error('Could not load workspaces');
      let list = await ws.json();

      if (!list.length) {
        const created = await fetch(`${api}/workspaces`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({ name: 'Personal Workspace' }),
        });
        if (!created.ok) throw new Error('Could not create your workspace');
        const item = await created.json();
        list = [item];
      }

      const org = list[0].id;
      setOrganizationId(org);

      const s = await fetch(`${api}/snapshot?organizationId=${org}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!s.ok) throw new Error('Could not load workspace data');
      const snapData = await s.json();
      setSnapshot(snapData);
      setHealth('Connected');

      // Update selected project default
      if (snapData.projects?.length && !selectedProject) {
        setSelectedProject(snapData.projects[0].id);
      }
    } catch (e: any) {
      setHealth(e.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    connect();
  }, []);

  // Periodic polling for active runs
  useEffect(() => {
    if (!accessToken || !organizationId) return;
    const interval = setInterval(async () => {
      try {
        const s = await fetch(`${api}/snapshot?organizationId=${organizationId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (s.ok) {
          const snapData = await s.json();
          setSnapshot(snapData);
        }
      } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, [accessToken, organizationId, api]);

  // Fetch job logs whenever a job is selected
  useEffect(() => {
    if (!selectedJob?.id || !accessToken) return;

    let isSubscribed = true;
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${api}/jobs/${selectedJob.id}/logs`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok && isSubscribed) {
          const data = await res.json();
          setSelectedJob((prev) => (prev ? { ...prev, logs: data.logs || [] } : undefined));
        }
      } catch {}
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 1500);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [selectedJob?.id, accessToken, api]);

  // Fetch Project Secrets & Webhook
  async function openProjectSettings(projectId: string) {
    setSelectedProjectForSecrets(projectId);
    try {
      const [secRes, hookRes] = await Promise.all([
        fetch(`${api}/projects/${projectId}/secrets`, { headers: { Authorization: `Bearer ${accessToken}` } }),
        fetch(`${api}/projects/${projectId}/webhook-config`, { headers: { Authorization: `Bearer ${accessToken}` } }),
      ]);
      if (secRes.ok) setProjectSecrets(await secRes.json());
      if (hookRes.ok) setWebhookConfig(await hookRes.json());
    } catch {}
  }

  async function saveSecret(e: any) {
    e.preventDefault();
    if (!selectedProjectForSecrets || !newSecretName || !newSecretValue) return;
    try {
      const res = await fetch(`${api}/projects/${selectedProjectForSecrets}/secrets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ name: newSecretName, value: newSecretValue }),
      });
      if (res.ok) {
        setNewSecretName('');
        setNewSecretValue('');
        openProjectSettings(selectedProjectForSecrets);
      }
    } catch {}
  }

  async function deleteSecret(name: string) {
    if (!selectedProjectForSecrets) return;
    try {
      await fetch(`${api}/projects/${selectedProjectForSecrets}/secrets/${name}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      openProjectSettings(selectedProjectForSecrets);
    } catch {}
  }

  async function registerProject(e: any) {
    e.preventDefault();
    setActionMessage('');
    try {
      const res = await fetch(`${api}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          organizationId,
          name: projectName,
          repo: projectRepo.trim() || null,
          defaultBranch: projectBranch,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not register project');
      setProjectName('');
      setProjectRepo('');
      setActionMessage('Project registered successfully.');
      await connect();
    } catch (err: any) {
      setActionMessage(err.message || 'Project registration failed');
    }
  }

  async function triggerRun(e: any) {
    e.preventDefault();
    setActionMessage('');
    try {
      const pId = selectedProject || snapshot?.projects?.[0]?.id;
      if (!pId) throw new Error('No project selected');

      const res = await fetch(`${api}/runs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          projectId: pId,
          branch,
          commitMessage,
          jobs: [
            { id: 'install', name: 'Install dependencies', stage: 'build', command: "if [ -f package.json ]; then if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then npm ci; else npm install; fi; elif [ -f requirements.txt ]; then python -m pip install -r requirements.txt; elif [ -f go.mod ]; then go mod download; elif [ -f Cargo.toml ]; then cargo fetch; else echo 'No dependency manifest found; skipping'; fi" },
            { id: 'test', name: 'Run test suite', stage: 'test', command: "if [ -f package.json ] && node -e \"process.exit(require('./package.json').scripts?.test ? 0 : 1)\"; then npm test; elif [ -f go.mod ]; then go test ./...; elif [ -f Cargo.toml ]; then cargo test; elif [ -f pytest.ini ] || [ -f tox.ini ]; then python -m pytest; else echo 'No test command detected; skipping'; fi", needs: ['install'] },
            { id: 'build', name: 'Build production bundle', stage: 'package', command: "if [ -f package.json ] && node -e \"process.exit(require('./package.json').scripts?.build ? 0 : 1)\"; then npm run build; elif [ -f go.mod ]; then go build ./...; elif [ -f Cargo.toml ]; then cargo build --release; elif [ -f pyproject.toml ] && python -m build --version >/dev/null 2>&1; then python -m build; else echo 'No build command detected; skipping'; fi", needs: ['test'] },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not trigger run');
      setActionMessage(`Pipeline run #${data.run_number} queued successfully.`);
      setInspectedRunId(data.id);
      await connect();
    } catch (err: any) {
      const message = err.message || 'Pipeline could not be queued';
      setActionMessage(message === 'Pipeline could not be queued'
        ? 'Pipeline could not be queued. No run was created. Please try again shortly; if it keeps happening, contact support.'
        : message);
    }
  }

  async function triggerDemoRun() {
    setActionMessage('');
    try {
      let pId = snapshot?.projects?.[0]?.id;
      if (!pId) {
        const createdProj = await fetch(`${api}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({
            organizationId,
            name: 'kestrel-demo',
            repo: 'https://github.com/peterakinwale326-code/Kestrel.git',
            defaultBranch: 'main',
          }),
        });
        const projData = await createdProj.json();
        pId = projData.id;
      }

      const res = await fetch(`${api}/runs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          projectId: pId,
          branch: 'main',
          commitMessage: 'Demo execution: standalone verification',
          jobs: [
            { id: 'install', name: 'Install dependencies', stage: 'build', command: "if [ -f package.json ]; then if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then npm ci; else npm install; fi; elif [ -f requirements.txt ]; then python -m pip install -r requirements.txt; elif [ -f go.mod ]; then go mod download; elif [ -f Cargo.toml ]; then cargo fetch; else echo 'No dependency manifest found; skipping'; fi" },
            { id: 'test', name: 'Run test suite', stage: 'test', command: "if [ -f package.json ] && node -e \"process.exit(require('./package.json').scripts?.test ? 0 : 1)\"; then npm test; elif [ -f go.mod ]; then go test ./...; elif [ -f Cargo.toml ]; then cargo test; elif [ -f pytest.ini ] || [ -f tox.ini ]; then python -m pytest; else echo 'No test command detected; skipping'; fi", needs: ['install'] },
            { id: 'build', name: 'Build production bundle', stage: 'package', command: "if [ -f package.json ] && node -e \"process.exit(require('./package.json').scripts?.build ? 0 : 1)\"; then npm run build; elif [ -f go.mod ]; then go build ./...; elif [ -f Cargo.toml ]; then cargo build --release; elif [ -f pyproject.toml ] && python -m build --version >/dev/null 2>&1; then python -m build; else echo 'No build command detected; skipping'; fi", needs: ['test'] },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to queue demo run');
      setActionMessage(`Demo run #${data.run_number} queued! Selected for live inspection.`);
      setInspectedRunId(data.id);
      await connect();
    } catch (e: any) {
      setActionMessage(e.message || 'Demo trigger failed');
    }
  }

  async function cancelRun(runId: string) {
    try {
      await fetch(`${api}/runs/${runId}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      connect();
    } catch {}
  }

  async function retryRun(runId: string) {
    try {
      await fetch(`${api}/runs/${runId}/retry`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      connect();
    } catch {}
  }

  async function loadDeployments(projectId = selectedProject) {
    if (!projectId || !accessToken) return;
    try {
      const response = await fetch(`${api}/projects/${projectId}/deployments`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load deployments');
      const environments = data.environments || [];
      setDeploymentEnvironments(environments);
      const histories = await Promise.all(environments.map(async (environment: any) => {
        const r = await fetch(`${api}/deployments/${environment.id}/releases`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const body = await r.json();
        return [environment.id, r.ok ? body.releases || [] : []] as const;
      }));
      setDeploymentReleases(Object.fromEntries(histories));
    } catch (error: any) {
      setActionMessage(error.message || 'Could not load deployments');
    }
  }

  async function provisionRustWorker(e: any) {
    e.preventDefault();
    if (!organizationId) return;
    setRustWorkerProvisioning(true);
    setActionMessage('');
    setRustWorkerCredential(null);
    try {
      const response = await fetch(`${api}/workspaces/${organizationId}/workers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ name: rustWorkerName, region: rustWorkerRegion, maxConcurrency: Number(rustWorkerConcurrency), runtime: 'rust' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not provision deployment worker');
      setRustWorkerCredential(data);
      setActionMessage('Worker credential created. Copy it now; it will not be shown again.');
      setShowRustSetup(true);
      await connect();
    } catch (error: any) {
      setActionMessage(error.message || 'Worker provisioning failed');
    } finally {
      setRustWorkerProvisioning(false);
    }
  }

  async function createDeploymentEnvironment(e: any) {
    e.preventDefault();
    setActionMessage('');
    try {
      const response = await fetch(`${api}/projects/${selectedProject}/deployments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          name: deploymentName, environmentKey: deploymentEnvironmentKey,
          workerId: deploymentWorkerId, hostPort: Number(deploymentHostPort),
          containerPort: Number(deploymentContainerPort), healthPath: deploymentHealthPath,
          publicUrl: deploymentPublicUrl || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create deployment environment');
      setActionMessage('Deployment environment created.');
      await loadDeployments(selectedProject);
    } catch (error: any) {
      setActionMessage(error.message || 'Deployment environment creation failed');
    }
  }

  async function deployImage(environmentId: string) {
    setActionMessage('');
    try {
      const response = await fetch(`${api}/deployments/${environmentId}/releases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ image: deploymentImage.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not queue deployment');
      setActionMessage(`Release #${data.release.releaseNumber} queued. It will run on the assigned Rust worker.`);
      await loadDeployments(selectedProject);
    } catch (error: any) {
      setActionMessage(error.message || 'Deployment request failed');
    }
  }

  async function rollbackDeployment(environmentId: string) {
    if (!window.confirm('Queue a rollback to the previous healthy release?')) return;
    setActionMessage('');
    try {
      const response = await fetch(`${api}/deployments/${environmentId}/rollback`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not queue rollback');
      setActionMessage(`Rollback release #${data.release.releaseNumber} queued.`);
      await loadDeployments(selectedProject);
    } catch (error: any) {
      setActionMessage(error.message || 'Rollback request failed');
    }
  }

  async function loadCompute() {
    if (!organizationId || !accessToken) return;
    try {
      const [instancesResponse, quotaResponse] = await Promise.all([
        fetch(`${api}/compute/instances?organizationId=${organizationId}`, { headers: { Authorization: `Bearer ${accessToken}` } }),
        fetch(`${api}/compute/quotas?organizationId=${organizationId}`, { headers: { Authorization: `Bearer ${accessToken}` } }),
      ]);
      const instancesBody = await instancesResponse.json();
      const quotaBody = await quotaResponse.json();
      if (!instancesResponse.ok) throw new Error(instancesBody.error || 'Could not load VMs');
      if (!quotaResponse.ok) throw new Error(quotaBody.error || 'Could not load compute quota');
      const instances = instancesBody.instances || [];
      setComputeInstances(instances);
      setComputeQuota(quotaBody.quota || null);
      const snapshots = await Promise.all(instances.map(async (vm: any) => {
        const response = await fetch(`${api}/compute/instances/${vm.id}/snapshots`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const body = await response.json();
        return [vm.id, response.ok ? body.snapshots || [] : []] as const;
      }));
      setComputeSnapshots(Object.fromEntries(snapshots));
    } catch (error: any) {
      setComputeMessage(error.message || 'Could not load compute resources');
    }
  }

  async function createComputeInstance(e: any) {
    e.preventDefault();
    setComputeBusy(true);
    setComputeMessage('');
    try {
      const response = await fetch(`${api}/compute/instances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          organizationId, provider: computeProvider, name: computeName, image: computeImage,
          vcpus: Number(computeVcpus), memoryMiB: Number(computeMemory), diskGiB: Number(computeDisk),
          region: computeRegion || null, sshPublicKey: computeSshKey.trim() || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not queue VM creation');
      setComputeMessage(`VM ${computeName} queued for provisioning. Its status will update as the provider host responds.`);
      await loadCompute();
    } catch (error: any) {
      setComputeMessage(error.message || 'VM creation failed');
    } finally {
      setComputeBusy(false);
    }
  }

  async function createComputeSnapshot(instanceId: string) {
    const name = window.prompt('Snapshot name (lowercase letters, numbers and hyphens)');
    if (!name) return;
    try {
      const response = await fetch(`${api}/compute/instances/${instanceId}/snapshots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create snapshot');
      setComputeMessage(`Snapshot ${name} queued.`);
      await loadCompute();
    } catch (error: any) {
      setComputeMessage(error.message || 'Snapshot creation failed');
    }
  }

  async function restoreComputeSnapshot(snapshotId: string) {
    if (!window.confirm('Restore this snapshot? Current VM data will be replaced.')) return;
    try {
      const response = await fetch(`${api}/compute/snapshots/${snapshotId}/restore`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not restore snapshot');
      setComputeMessage('Snapshot restore queued.');
      await loadCompute();
    } catch (error: any) {
      setComputeMessage(error.message || 'Snapshot restore failed');
    }
  }

  async function deleteComputeSnapshot(snapshotId: string) {
    if (!window.confirm('Delete this snapshot permanently?')) return;
    try {
      const response = await fetch(`${api}/compute/snapshots/${snapshotId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not delete snapshot');
      setComputeMessage('Snapshot deletion queued.');
      await loadCompute();
    } catch (error: any) {
      setComputeMessage(error.message || 'Snapshot deletion failed');
    }
  }

  async function loadSandboxes() {
    if (!organizationId || !accessToken) return;
    try {
      const response = await fetch(`${api}/workspaces/${organizationId}/sandboxes`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load sandboxes');
      setSandboxInstances(data.sandboxes || []);
      setSandboxQuota(data.quota || null);
    } catch (error: any) {
      setSandboxMessage(error.message || 'Sandbox list failed');
    }
  }

  async function createSandbox(e: any) {
    e.preventDefault();
    setSandboxBusy(true);
    setSandboxMessage('');
    try {
      const response = await fetch(`${api}/workspaces/${organizationId}/sandboxes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ name: sandboxName, vcpus: Number(sandboxVcpus), region: sandboxRegion, timeoutSeconds: Number(sandboxTimeout) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create sandbox');
      setSandboxMessage(`Sandbox ${sandboxName} provisioned.`);
      await loadSandboxes();
    } catch (error: any) {
      setSandboxMessage(error.message || 'Sandbox provisioning failed');
    } finally {
      setSandboxBusy(false);
    }
  }

  async function sandboxAction(id: string, action: 'start' | 'stop') {
    try {
      const response = await fetch(`${api}/sandboxes/${id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Could not ${action} sandbox`);
      setSandboxMessage(`Sandbox ${action} request completed.`);
      await loadSandboxes();
    } catch (error: any) {
      setSandboxMessage(error.message || `Sandbox ${action} failed`);
    }
  }

  async function deleteSandbox(id: string) {
    if (!window.confirm('Delete this sandbox and its saved state?')) return;
    try {
      const response = await fetch(`${api}/sandboxes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not delete sandbox');
      setSandboxMessage('Sandbox deleted.');
      await loadSandboxes();
    } catch (error: any) {
      setSandboxMessage(error.message || 'Sandbox deletion failed');
    }
  }

  async function executeSandboxCommand(id: string) {
    const commandLine = (sandboxCommands[id] || '').trim();
    if (!commandLine) return;
    setSandboxResults((current) => ({ ...current, [id]: { busy: true, output: '' } }));
    try {
      const response = await fetch(`${api}/sandboxes/${id}/commands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ command: 'sh', args: ['-lc', commandLine], cwd: '/vercel/sandbox', timeoutSeconds: 30 }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Command failed');
      setSandboxResults((current) => ({ ...current, [id]: { busy: false, exitCode: data.exitCode, output: (data.stdout || '') + (data.stderr || '') } }));
      await loadSandboxes();
    } catch (error: any) {
      setSandboxResults((current) => ({ ...current, [id]: { busy: false, exitCode: null, output: error.message || 'Execution failed' } }));
    }
  }

  async function copySshCommand(ip: string) {
    try {
      await navigator.clipboard.writeText(`ssh kestrel@${ip}`);
      setComputeMessage('SSH command copied to clipboard.');
    } catch {
      setComputeMessage(`SSH command: ssh kestrel@${ip}`);
    }
  }

  async function computeInstanceAction(instanceId: string, action: 'start' | 'stop' | 'delete') {
    if (action === 'delete' && !window.confirm('Delete this virtual machine and release its allocated capacity?')) return;
    setComputeMessage('');
    try {
      const response = await fetch(`${api}/compute/instances/${instanceId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Could not ${action} VM`);
      setComputeMessage(`VM ${action} request queued.`);
      await loadCompute();
    } catch (error: any) {
      setComputeMessage(error.message || `VM ${action} failed`);
    }
  }

  useEffect(() => {
    if (page !== 'compute' || !organizationId || !accessToken) return;
    loadCompute();
    const timer = setInterval(loadCompute, 4000);
    return () => clearInterval(timer);
  }, [page, organizationId, accessToken, api]);

  useEffect(() => {
    if (page !== 'sandboxes' || !organizationId || !accessToken) return;
    loadSandboxes();
    const timer = setInterval(loadSandboxes, 5000);
    return () => clearInterval(timer);
  }, [page, organizationId, accessToken, api]);

  useEffect(() => {
    if (page !== 'deployments' || !selectedProject || !accessToken) return;
    loadDeployments(selectedProject);
    const timer = setInterval(() => loadDeployments(selectedProject), 5000);
    return () => clearInterval(timer);
  }, [page, selectedProject, accessToken]);

  async function downloadArtifact(artifactId: string) {
    setActionMessage('');
    try {
      const response = await fetch(`${api}/artifacts/${artifactId}/download`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not prepare artifact download');
      const link = document.createElement('a');
      link.href = data.url;
      link.download = data.name || 'kestrel-artifact';
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      setActionMessage(error.message || 'Artifact download failed');
    }
  }

  async function deleteArtifact(artifactId: string) {
    if (!window.confirm('Permanently delete this stored artifact?')) return;
    setActionMessage('');
    try {
      const response = await fetch(`${api}/artifacts/${artifactId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not delete artifact');
      setActionMessage('Artifact deleted.');
      await connect();
    } catch (error: any) {
      setActionMessage(error.message || 'Artifact deletion failed');
    }
  }

  const counts = useMemo(
    () => ({
      projects: snapshot?.projects?.length ?? 0,
      runs: snapshot?.runs?.length ?? 0,
      workers: snapshot?.workers?.length ?? 0,
      artifacts: snapshot?.artifacts?.length ?? 0,
    }),
    [snapshot]
  );

  const inspectedRun = useMemo(() => {
    if (!inspectedRunId || !snapshot?.runs) return null;
    return snapshot.runs.find((r: any) => r.id === inspectedRunId) || null;
  }, [inspectedRunId, snapshot]);

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''} ${mobile ? 'mobile-open' : ''}`}>
        <div className="app-brand-row">
          <Brand />
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            <Menu size={16} />
          </button>
        </div>
        <div className="workspace-switch">
          <div className="workspace-avatar">K</div>
          <span>
            <b>Workspace</b>
            <small>Kestrel CI</small>
          </span>
          <ChevronDown size={14} />
        </div>
        {['WORKSPACE', 'MANAGE'].map((group) => (
          <div className="nav-group" key={group}>
            <small>{group}</small>
            {nav
              .filter((n) => n.group === group)
              .map((n) => (
                <button
                  key={n.id}
                  className={`side-link ${page === n.id ? 'selected' : ''}`}
                  onClick={() => {
                    setInspectedRunId(null);
                    go(n.id);
                  }}
                >
                  <n.icon size={17} />
                  <span>{n.label}</span>
                </button>
              ))}
          </div>
        ))}
        <div className="sidebar-bottom">
          <div className="plan-card">
            <Zap size={15} />
            <b>Build capacity</b>
            <p>Connect workers to increase parallel execution.</p>
            <button onClick={() => go('pricing')}>
              View plans <ArrowRight size={13} />
            </button>
          </div>
          <div className="profile-row">
            <div className="profile-avatar">P</div>
            <span>
              <b>Workspace Owner</b>
              <small>Administrator</small>
            </span>
            <ChevronDown size={14} />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="app-main">
        <header className="app-topbar">
          <button className="mobile-menu" onClick={() => setMobile(!mobile)}>
            <Menu />
          </button>
          <div className="breadcrumbs">
            Workspace <span>/</span> <b>{active.label}</b>
          </div>
          <div className="top-actions">
            <span className={`connection ${health === 'Connected' ? 'connected' : ''}`}>
              <i /> {health}
            </span>
            <button className="icon-btn" title="Help" onClick={() => go('docs')}>
              <CircleHelp size={17} />
            </button>
            <div className="profile-avatar small">P</div>
          </div>
        </header>

        {/* OVERVIEW */}
        {page === 'overview' && !inspectedRun && (
          <>
            <div className="page-heading">
              <div>
                <div className="eyebrow">WORKSPACE / OVERVIEW</div>
                <h1>Delivery overview</h1>
                <p>Your distributed build system at a glance.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={triggerDemoRun} kind="light">
                  <Zap size={14} /> Quick Demo Run
                </Button>
                <Button onClick={() => go('pipelines')}>
                  <Play size={14} /> Trigger pipeline
                </Button>
              </div>
            </div>
            <div className="metric-grid">
              {[
                { label: 'Projects', value: counts.projects, icon: Layers3, sub: 'Connected repos' },
                { label: 'Pipeline runs', value: counts.runs, icon: Workflow, sub: 'Recorded runs' },
                { label: 'Active workers', value: counts.workers, icon: Server, sub: 'Execution nodes' },
                { label: 'Artifacts', value: counts.artifacts, icon: Boxes, sub: 'Build outputs' },
              ].map((m) => (
                <div className="metric-card" key={m.label}>
                  <div>
                    <span>{m.label}</span>
                    <m.icon size={17} />
                  </div>
                  <strong>{m.value.toString().padStart(2, '0')}</strong>
                  <small>{m.sub}</small>
                </div>
              ))}
            </div>
            <div className="dashboard-grid">
              <section className="panel recent-panel">
                <div className="panel-head">
                  <div>
                    <h3>Recent pipeline runs</h3>
                    <p>Click any execution to inspect job logs</p>
                  </div>
                  <button onClick={() => go('runs')}>
                    View all history <ArrowUpRight size={14} />
                  </button>
                </div>
                {snapshot?.runs?.length ? (
                  snapshot.runs.slice(0, 6).map((r: any) => (
                    <div
                      className="table-row cursor-pointer hover:bg-neutral-50 transition"
                      key={r.id}
                      onClick={() => setInspectedRunId(r.id)}
                    >
                      <StatusIndicator status={r.status as JobStatus} />
                      <div className="flex-1">
                        <b>{r.commitMessage || r.id}</b>
                        <small>
                          {r.branch} · {r.id.slice(0, 8)}
                        </small>
                      </div>
                      <span className="row-meta">{r.jobs?.length || 0} jobs</span>
                      <span className="text-xs text-neutral-500 font-mono">
                        {new Date(r.triggeredAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <Empty
                    icon={Workflow}
                    title="No pipeline runs yet"
                    desc="Connect a project and trigger your first distributed pipeline."
                    action="Go to pipelines"
                    onClick={() => go('pipelines')}
                  />
                )}
              </section>

              <section className="panel system-panel">
                <div className="panel-head">
                  <div>
                    <h3>System health</h3>
                    <p>Control plane status</p>
                  </div>
                  <span className={`pill ${health === 'Connected' ? 'pill-green' : 'pill-muted'}`}>{health}</span>
                </div>
                <div className="system-status">
                  <div>
                    <span>API endpoint</span>
                    <b>{api}</b>
                  </div>
                  <div>
                    <span>Workers</span>
                    <b>{counts.workers} registered</b>
                  </div>
                  <div>
                    <span>Isolation</span>
                    <b>Linux containers / Non-root</b>
                  </div>
                </div>
                <button className="outline-wide" onClick={connect}>
                  {loading ? 'Refreshing…' : 'Refresh workspace'} <ArrowRight size={14} />
                </button>
              </section>
            </div>
          </>
        )}

        {/* PIPELINES */}
        {page === 'pipelines' && !inspectedRun && (
          <div className="page-content">
            <div className="page-heading">
              <div>
                <div className="eyebrow">WORKSPACE / PIPELINES</div>
                <h1>Pipeline trigger</h1>
                <p>Run your project's install, test, and build steps in sequence.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={triggerDemoRun} kind="light">
                  <Zap size={14} /> Quick Demo Run
                </Button>
                <Button onClick={() => go('projects')}>
                  <Plus size={15} /> Add repository
                </Button>
              </div>
            </div>
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h3>Queue pipeline execution</h3>
                  <p>Kestrel will prepare and run each stage automatically.</p>
                </div>
                <span className="pill pill-muted">{counts.projects} projects</span>
              </div>
              {snapshot?.projects?.length ? (
                <form className="pipeline-form" onSubmit={triggerRun}>
                  <label>
                    Project
                    <select
                      required
                      value={selectedProject || snapshot.projects[0].id}
                      onChange={(e) => setSelectedProject(e.target.value)}
                    >
                      {snapshot.projects.map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.defaultBranch})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Branch
                    <input value={branch} onChange={(e) => setBranch(e.target.value)} required />
                  </label>
                  <label>
                    Commit message / description
                    <input value={commitMessage} onChange={(e) => setCommitMessage(e.target.value)} required />
                  </label>
                  <div className="job-preview">
                    <b>DAG Pipeline Stages:</b>
                    <span>01 · npm ci (Install)</span>
                    <span>02 · npm test (Test suite, depends on Install)</span>
                    <span>03 · npm run build (Bundle & Artifacts, depends on Test)</span>
                  </div>
                  <Button type="submit">
                    Queue pipeline run <Play size={14} />
                  </Button>
                </form>
              ) : (
                <Empty
                  icon={Workflow}
                  title="No projects registered"
                  desc="Register a repository first to make it available for execution."
                  action="Manage projects"
                  onClick={() => go('projects')}
                />
              )}
            </div>
            {actionMessage && <div className="action-message mt-4">{actionMessage}</div>}
          </div>
        )}

        {/* RUN HISTORY & RUN INSPECTION */}
        {(page === 'runs' || inspectedRun) && (
          <div className="page-content">
            {inspectedRun ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <button
                      className="text-xs text-neutral-500 hover:text-neutral-900 mb-2 inline-flex items-center gap-1 font-medium"
                      onClick={() => {
                        setInspectedRunId(null);
                        setSelectedJob(undefined);
                      }}
                    >
                      ← Back to runs list
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-3">
                      Run #{inspectedRun.runNumber} · {inspectedRun.commitMessage}
                      <StatusIndicator status={inspectedRun.status as JobStatus} />
                    </h1>
                    <p className="text-xs text-neutral-500 mt-1">
                      Branch: <span className="font-mono">{inspectedRun.branch}</span> · Triggered:{' '}
                      {new Date(inspectedRun.triggeredAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {inspectedRun.status === 'running' || inspectedRun.status === 'queued' ? (
                      <Button kind="light" onClick={() => cancelRun(inspectedRun.id)}>
                        <Square size={13} className="text-red-600" /> Cancel run
                      </Button>
                    ) : (
                      <Button kind="light" onClick={() => retryRun(inspectedRun.id)}>
                        <RotateCcw size={13} /> Retry run
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Job List */}
                  <div className="panel col-span-1">
                    <div className="panel-head border-b pb-3 mb-3">
                      <h3>Pipeline Jobs ({inspectedRun.jobs?.length || 0})</h3>
                      <small>Select job for live logs</small>
                    </div>
                    <div className="space-y-2">
                      {inspectedRun.jobs?.map((j: any) => {
                        const isSelected = selectedJob?.id === (j.internalId || j.id);
                        return (
                          <div
                            key={j.id}
                            onClick={() =>
                              setSelectedJob({
                                id: j.internalId || j.id,
                                name: j.name,
                                stage: j.stage,
                                command: j.command || '',
                                needs: j.needs || [],
                                status: j.status,
                                durationMs: j.durationMs || 0,
                                workerId: j.workerId || 'Pending',
                                arch: 'linux/amd64',
                                cacheDigest: '',
                                cacheHit: false,
                                exitCode: j.exitCode,
                                memoryLimitMb: 2048,
                                cpuMillicores: 1000,
                                logs: [],
                              })
                            }
                            className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                              isSelected
                                ? 'border-neutral-900 bg-neutral-50 font-semibold'
                                : 'border-neutral-200 hover:border-neutral-400'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-mono">{j.name}</div>
                              <div className="text-[10px] text-neutral-500 uppercase tracking-wide">
                                Stage: {j.stage}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-neutral-400 font-mono">
                                {formatDuration(j.durationMs)}
                              </span>
                              <StatusIndicator status={j.status as JobStatus} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Log Viewer Panel */}
                  <div className="col-span-2 min-h-[500px]">
                    <LogViewer
                      job={selectedJob}
                      onCancelJob={(jobId) => {
                        fetch(`${api}/jobs/${jobId}/cancel`, {
                          method: 'POST',
                          headers: { Authorization: `Bearer ${accessToken}` },
                        }).then(() => connect());
                      }}
                      onRerunJob={() => retryRun(inspectedRun.id)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <PageHeading
                  eyebrow="WORKSPACE / RUN HISTORY"
                  title="Run history"
                  desc="Traceable records of pipeline executions, statuses and step outputs."
                />
                <div className="panel">
                  <div className="panel-head">
                    <div>
                      <h3>Recorded Executions</h3>
                      <p>Select any run to inspect sandboxed execution and live logs.</p>
                    </div>
                    <Button kind="light" onClick={connect}>
                      Refresh <Activity size={14} />
                    </Button>
                  </div>
                  {snapshot?.runs?.length ? (
                    snapshot.runs.map((r: any) => (
                      <div
                        className="table-row cursor-pointer hover:bg-neutral-50 transition"
                        key={r.id}
                        onClick={() => setInspectedRunId(r.id)}
                      >
                        <StatusIndicator status={r.status as JobStatus} />
                        <div className="flex-1">
                          <b>
                            #{r.runNumber} · {r.commitMessage || 'Manual run'}
                          </b>
                          <small>
                            {r.branch} {r.commitSha ? `(${r.commitSha.slice(0, 7)})` : ''} · {r.id.slice(0, 8)}
                          </small>
                        </div>
                        <span className="row-meta">{r.jobs?.length || 0} jobs</span>
                        <span className="text-xs text-neutral-500 font-mono">
                          {new Date(r.triggeredAt).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <Empty
                      icon={Clock3}
                      title="No runs recorded"
                      desc="Pipeline runs will appear here after a project is registered and triggered."
                      action="Go to pipelines"
                      onClick={() => go('pipelines')}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROJECTS */}
        {page === 'projects' && !inspectedRun && (
          <div className="page-content">
            <PageHeading
              eyebrow="WORKSPACE / PROJECTS"
              title="Projects & Repositories"
              desc="Connect repositories and manage project configuration."
            />
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h3>Register a repository</h3>
                  <p>Add a credential-free HTTPS Git URL on an approved host.</p>
                </div>
              </div>
              <form className="project-form" onSubmit={registerProject}>
                <label>
                  Project name
                  <input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="kestrel-app"
                    required
                  />
                </label>
                <label>
                  Repository URL (optional)
                  <input
                    value={projectRepo}
                    onChange={(e) => setProjectRepo(e.target.value)}
                    placeholder="https://github.com/org/repo.git"
                  />
                </label>
                <label>
                  Default branch
                  <input
                    value={projectBranch}
                    onChange={(e) => setProjectBranch(e.target.value)}
                    placeholder="main"
                    required
                  />
                </label>
                <Button type="submit">
                  Register project <Plus size={14} />
                </Button>
              </form>
            </div>
            {actionMessage && <div className="action-message mt-4">{actionMessage}</div>}

            <div className="panel mt-6">
              <div className="panel-head">
                <div>
                  <h3>Connected Projects</h3>
                  <p>Click "Settings & Secrets" to manage encrypted environment variables and webhooks.</p>
                </div>
              </div>
              {snapshot?.projects?.length ? (
                snapshot.projects.map((p: any) => (
                  <div className="project-entry" key={p.id}>
                    <div className="table-row justify-between">
                      <div className="flex items-center gap-3">
                        <Github size={18} />
                        <div>
                          <b>{p.name}</b>
                          <small>
                            {p.repo || 'Uploaded source'} · {p.defaultBranch || 'main'}
                          </small>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button kind="light" onClick={() => openProjectSettings(p.id)}>
                          <KeyRound size={13} /> Secrets & Webhook
                        </Button>
                      </div>
                    </div>
                    <ProjectFiles projectId={p.id} accessToken={accessToken} apiBase={api} />
                  </div>
                ))
              ) : (
                <Empty
                  icon={Github}
                  title="No projects registered"
                  desc="Register a repository above to enable pipeline triggers."
                />
              )}
            </div>

            {/* Project Secrets & Webhook Modal */}
            {selectedProjectForSecrets && (
              <div className="panel mt-6 border-2 border-neutral-900">
                <div className="panel-head justify-between">
                  <div>
                    <h3>Project Security & Webhooks</h3>
                    <p>AES-256-GCM encrypted secrets are injected into worker sandboxes at runtime.</p>
                  </div>
                  <button
                    className="icon-btn"
                    onClick={() => {
                      setSelectedProjectForSecrets(null);
                      setWebhookConfig(null);
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* GitHub Webhook Info */}
                {webhookConfig && (
                  <div className="bg-neutral-50 p-4 rounded-lg mb-6 border">
                    <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                      <Webhook size={14} /> GitHub Webhook Configuration
                    </div>
                    <p className="text-xs text-neutral-600 mb-2">
                      In your GitHub repository settings &gt; Webhooks, add this endpoint to trigger runs on push:
                    </p>
                    <div className="text-xs font-mono bg-white p-2 border rounded select-all mb-2">
                      Payload URL: {window.location.origin}/api/webhooks/github
                    </div>
                    <div className="text-xs font-mono bg-white p-2 border rounded select-all">
                      Secret: {webhookConfig.webhookSecret}
                    </div>
                  </div>
                )}

                {/* Secrets list */}
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Configured Secrets ({projectSecrets.length})
                </h4>
                {projectSecrets.length ? (
                  <div className="space-y-2 mb-6">
                    {projectSecrets.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-2 bg-neutral-50 border rounded text-xs font-mono">
                        <span className="font-bold">{s.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-neutral-400">••••••••••••••••</span>
                          <button
                            onClick={() => deleteSecret(s.name)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete secret"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 mb-4">No secrets defined yet.</p>
                )}

                {/* Add secret form */}
                <form onSubmit={saveSecret} className="flex flex-wrap gap-2 items-end">
                  <label className="text-xs">
                    Secret Name
                    <input
                      placeholder="NPM_TOKEN"
                      value={newSecretName}
                      onChange={(e) => setNewSecretName(e.target.value.toUpperCase())}
                      className="text-xs font-mono"
                      required
                    />
                  </label>
                  <label className="text-xs flex-1">
                    Secret Value
                    <input
                      type="password"
                      placeholder="Secret token or key"
                      value={newSecretValue}
                      onChange={(e) => setNewSecretValue(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </label>
                  <Button type="submit">Add Secret</Button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* DEPLOYMENTS */}
        {page === 'deployments' && !inspectedRun && (
          <div className="page-content">
            <PageHeading
              eyebrow="WORKSPACE / DEPLOYMENTS"
              title="Deployment environments"
              desc="Release container images to assigned Rust workers, verify health and roll back to the previous healthy release."
            />
            <div className="panel deployment-project-panel">
              <div className="panel-head">
                <div><h3>Project scope</h3><p>Choose the project whose environments you want to manage.</p></div>
              </div>
              <div className="deployment-form-grid">
                <label>Project
                  <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                    {(snapshot?.projects || []).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </label>
              </div>
            </div>

            <div className="panel deployment-worker-setup">
              <div className="panel-head">
                <div><h3>Deployment workers</h3><p>Connect a Linux host with Docker Engine to run container releases.</p></div>
                <span className={snapshot?.workers?.some((w: any) => w.runtime === 'rust' && w.state === 'online') ? 'pill pill-green' : 'pill pill-muted'}>
                  {snapshot?.workers?.filter((w: any) => w.runtime === 'rust').length || 0} CONNECTED
                </span>
              </div>
              {snapshot?.workers?.some((w: any) => w.runtime === 'rust') ? (
                <div className="deployment-worker-connected">
                  <div>
                    <b>{snapshot.workers.filter((w: any) => w.runtime === 'rust').map((w: any) => w.hostname).join(', ')}</b>
                    <p>Rust runtime registered. Workers can be connected from this workspace.</p>
                  </div>
                  <button className="btn btn-light" onClick={() => { setShowRustSetup(!showRustSetup); setRustWorkerCredential(null); }}>Connect another worker <Plus size={14} /></button>
                </div>
              ) : (
                <div className="deployment-worker-empty">
                  <div className="deployment-worker-icon"><Server size={20} /></div>
                  <b>No deployment worker is connected yet</b>
                  <p>Pipeline workers can run tests and builds. Container deployments need a Linux host with Docker Engine. Provision a worker credential, then install the Rust runtime on that host.</p>
                  <button className="btn btn-dark" onClick={() => setShowRustSetup(!showRustSetup)}><Plus size={14} /> Set up deployment worker</button>
                </div>
              )}
              {showRustSetup && (
                <div className="deployment-worker-wizard">
                  {!rustWorkerCredential ? (
                    <form onSubmit={provisionRustWorker} className="deployment-form-grid">
                      <label>Worker name
                        <input value={rustWorkerName} onChange={(e) => setRustWorkerName(e.target.value)} maxLength={80} required />
                      </label>
                      <label>Region label
                        <input value={rustWorkerRegion} onChange={(e) => setRustWorkerRegion(e.target.value)} placeholder="e.g. eu-west" maxLength={80} />
                      </label>
                      <label>Maximum concurrent deployments/jobs
                        <select value={rustWorkerConcurrency} onChange={(e) => setRustWorkerConcurrency(e.target.value)}>
                          <option value="1">1 (recommended for small host)</option><option value="2">2</option><option value="4">4</option>
                        </select>
                      </label>
                      <div className="deployment-wide"><Button type="submit" disabled={rustWorkerProvisioning}>{rustWorkerProvisioning ? 'Provisioning…' : 'Generate one-time worker credential'} <ArrowRight size={14} /></Button></div>
                    </form>
                  ) : (
                    <div className="deployment-worker-instructions">
                      <div className="notice"><ShieldCheck size={15} /> This token is shown once. Store it securely; do not paste it into a public repository or chat.</div>
                      <label>Worker ID <code>{rustWorkerCredential.workerId}</code><button type="button" onClick={() => navigator.clipboard?.writeText(rustWorkerCredential.workerId)}>Copy</button></label>
                      <label>One-time token <code className="credential-token">{rustWorkerCredential.token}</code><button type="button" onClick={() => navigator.clipboard?.writeText(rustWorkerCredential.token)}>Copy token</button></label>
                      <div className="setup-steps">
                        <b>On a dedicated Ubuntu/Debian Linux host</b>
                        <ol>
                          <li>Install Docker Engine and make sure the host can run containers.</li>
                          <li>Download and run the installer below.</li>
                          <li>When prompted, enter the Worker ID, API URL, region, concurrency value and one-time token above.</li>
                          <li>Return here; once the worker heartbeat is online, create an environment.</li>
                        </ol>
                      </div>
                      <div className="setup-command"><code>curl -fsSL https://raw.githubusercontent.com/peterakinwale326-code/Kestrel/main/deploy/install-rust-worker.sh | sudo bash</code><button type="button" onClick={() => navigator.clipboard?.writeText('curl -fsSL https://raw.githubusercontent.com/peterakinwale326-code/Kestrel/main/deploy/install-rust-worker.sh | sudo bash')}>Copy installer command</button></div>
                      <p className="deployment-muted">Use a dedicated host only. The worker controls Docker, which is effectively host-root access. Vercel sandboxes do not expose a Docker daemon, so they cannot host this container deployment worker.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="panel">
              <div className="panel-head">
                <div><h3>Create environment</h3><p>Assign a published host port on a Rust execution worker.</p></div>
                <span className="pill pill-muted">CONTAINER DEPLOYMENT</span>
              </div>
              {snapshot?.workers?.some((w: any) => w.runtime === 'rust') ? (
                <form className="deployment-form-grid" onSubmit={createDeploymentEnvironment}>
                  <label>Environment name
                    <input value={deploymentName} onChange={(e) => setDeploymentName(e.target.value)} required maxLength={80} />
                  </label>
                  <label>Environment type
                    <select value={deploymentEnvironmentKey} onChange={(e) => setDeploymentEnvironmentKey(e.target.value)}>
                      <option value="development">Development</option><option value="staging">Staging</option>
                      <option value="production">Production</option><option value="preview">Preview</option>
                    </select>
                  </label>
                  <label>Rust worker
                    <select value={deploymentWorkerId} onChange={(e) => setDeploymentWorkerId(e.target.value)} required>
                      <option value="">Choose a Rust worker</option>
                      {snapshot.workers.filter((w: any) => w.runtime === 'rust').map((w: any) => (
                        <option key={w.id} value={w.id}>{w.hostname} · {w.state}</option>
                      ))}
                    </select>
                  </label>
                  <label>Published host port
                    <input type="number" min="1024" max="65535" value={deploymentHostPort} onChange={(e) => setDeploymentHostPort(e.target.value)} required />
                  </label>
                  <label>Container port
                    <input type="number" min="1" max="65535" value={deploymentContainerPort} onChange={(e) => setDeploymentContainerPort(e.target.value)} required />
                  </label>
                  <label>Health-check path
                    <input value={deploymentHealthPath} onChange={(e) => setDeploymentHealthPath(e.target.value)} required placeholder="/" />
                  </label>
                  <label className="deployment-wide">Public URL (optional)
                    <input value={deploymentPublicUrl} onChange={(e) => setDeploymentPublicUrl(e.target.value)} placeholder="https://app.example.com" />
                  </label>
                  <div className="deployment-wide"><Button type="submit" disabled={!selectedProject || !deploymentWorkerId}>Create environment <Plus size={14} /></Button></div>
                </form>
              ) : (
                <div className="deployment-empty">
                  <b>No Rust workers are connected to this workspace.</b>
                  <p>No online Rust deployment worker yet. Complete the setup steps above; Node workers can still run pipelines.</p>
                </div>
              )}
            </div>

            {actionMessage && <div className="action-message deployment-message">{actionMessage}</div>}

            {deploymentEnvironments.length ? deploymentEnvironments.map((environment: any) => (
              <section className="panel deployment-environment" key={environment.id}>
                <div className="panel-head">
                  <div>
                    <h3>{environment.name} <span className="deployment-tag">{environment.environmentKey}</span></h3>
                    <p>{environment.workerName} · Worker {environment.workerState} · Port {environment.hostPort}:{environment.containerPort}</p>
                  </div>
                  <span className={`pill ${environment.currentReleaseStatus === 'healthy' ? 'pill-green' : 'pill-muted'}`}>
                    {environment.pendingReleaseStatus || environment.currentReleaseStatus || 'NOT DEPLOYED'}
                  </span>
                </div>
                <div className="deployment-meta">
                  <span>Health path: <b>{environment.healthPath}</b></span>
                  <span>Current image: <b>{environment.currentImage || 'None'}</b></span>
                  <span>Last health check: <b>{environment.lastHealthCheck ? new Date(environment.lastHealthCheck).toLocaleString() : 'Not checked'}</b></span>
                  {environment.publicUrl && <a href={environment.publicUrl} target="_blank" rel="noreferrer">Open application <ArrowUpRight size={13} /></a>}
                </div>
                <div className="deployment-release-actions">
                  <input value={deploymentImage} onChange={(e) => setDeploymentImage(e.target.value)} placeholder="Container image, e.g. ghcr.io/org/app:1.2.0" />
                  <Button onClick={() => deployImage(environment.id)} disabled={!deploymentImage.trim() || ['queued','deploying'].includes(environment.pendingReleaseStatus)}>Deploy image <Play size={13} /></Button>
                  <Button kind="light" onClick={() => rollbackDeployment(environment.id)} disabled={!environment.currentReleaseId || ['queued','deploying'].includes(environment.currentReleaseStatus)}>Rollback</Button>
                </div>
                <div className="deployment-history">
                  <b>Release history</b>
                  {(deploymentReleases[environment.id] || []).length ? (deploymentReleases[environment.id] || []).map((release: any) => (
                    <div className="table-row" key={release.id}>
                      <StatusIndicator status={release.status === 'healthy' ? 'succeeded' : release.status === 'failed' ? 'failed' : 'running'} />
                      <div className="flex-1"><b>Release #{release.releaseNumber}</b><small>{release.image} · {release.status}{release.rollbackOf ? ' · Rollback' : ''}</small></div>
                      <span className="row-meta">{release.deployedAt ? new Date(release.deployedAt).toLocaleString() : new Date(release.createdAt).toLocaleString()}</span>
                    </div>
                  )) : <p className="deployment-muted">No releases yet.</p>}
                </div>
              </section>
            )) : (
              <div className="panel deployment-empty"><b>No deployment environments configured.</b><p>Create an environment above after connecting a Rust worker.</p></div>
            )}
          </div>
        )}

        {/* COMPUTE */}
        {page === 'compute' && !inspectedRun && (
          <div className="page-content">
            <PageHeading
              eyebrow="INFRASTRUCTURE / COMPUTE"
              title="Virtual machines"
              desc="Create and manage VMs on dedicated Kestrel provider hosts. Provisioning is asynchronous and depends on an online host with available capacity."
            />
            {computeQuota && (
              <div className="metric-grid">
                {[
                  { label: 'VM instances', used: computeQuota.usedInstances, max: computeQuota.maxInstances, unit: '' },
                  { label: 'vCPU', used: computeQuota.usedVcpu, max: computeQuota.maxVcpu, unit: '' },
                  { label: 'Memory', used: computeQuota.usedMemoryMiB, max: computeQuota.maxMemoryMiB, unit: ' MiB' },
                  { label: 'Storage', used: computeQuota.usedDiskGiB, max: computeQuota.maxDiskGiB, unit: ' GiB' },
                ].map((item) => (
                  <div className="metric-card" key={item.label}>
                    <div><span>{item.label}</span><Cpu size={16} /></div>
                    <strong>{item.used}{item.unit}</strong>
                    <small>of {item.max}{item.unit} allocated</small>
                  </div>
                ))}
              </div>
            )}
            <div className="panel">
              <div className="panel-head">
                <div><h3>Create a virtual machine</h3><p>Choose an available provider pool and specify the guest resources.</p></div>
                <span className="pill pill-muted">ASYNC PROVISIONING</span>
              </div>
              <form className="deployment-form-grid" onSubmit={createComputeInstance}>
                <label>Provider
                  <select value={computeProvider} onChange={(e) => {
                    setComputeProvider(e.target.value);
                    setComputeImage(e.target.value === 'incus' ? 'ubuntu:24.04' : e.target.value === 'firecracker' ? 'ubuntu-24.04.ext4' : 'quay.io/containerdisks/ubuntu:24.04');
                  }}>
                    <option value="incus">Incus · General-purpose VM</option>
                    <option value="firecracker">Firecracker · MicroVM</option>
                    <option value="kubevirt">KubeVirt · Kubernetes VM</option>
                  </select>
                </label>
                <label>VM name
                  <input value={computeName} onChange={(e) => setComputeName(e.target.value)} pattern="[a-z0-9][a-z0-9-]{0,61}[a-z0-9]" minLength={1} maxLength={63} required />
                </label>
                <label>Image / rootfs reference
                  <input value={computeImage} onChange={(e) => setComputeImage(e.target.value)} maxLength={512} required />
                </label>
                <label>vCPU
                  <input type="number" min="1" max="64" value={computeVcpus} onChange={(e) => setComputeVcpus(e.target.value)} required />
                </label>
                <label>Memory (MiB)
                  <input type="number" min="512" max="262144" step="512" value={computeMemory} onChange={(e) => setComputeMemory(e.target.value)} required />
                </label>
                <label>Disk (GiB)
                  <input type="number" min="5" max="4096" value={computeDisk} onChange={(e) => setComputeDisk(e.target.value)} required />
                </label>
                <label>Region (optional)
                  <input value={computeRegion} onChange={(e) => setComputeRegion(e.target.value)} maxLength={80} placeholder="Any available region" />
                </label>
                <label className="deployment-wide">SSH public key (optional)
                  <input value={computeSshKey} onChange={(e) => setComputeSshKey(e.target.value)} maxLength={16384} placeholder="ssh-ed25519 AAAA..." />
                </label>
                <div className="deployment-wide">
                  <Button type="submit" disabled={computeBusy || !organizationId || !computeImage.trim()}>
                    {computeBusy ? 'Queueing VM…' : 'Create virtual machine'} <Plus size={14} />
                  </Button>
                </div>
              </form>
              <p className="deployment-muted">
                Firecracker requires an operator-installed rootfs filename. Incus uses a configured image alias. KubeVirt uses a containerDisk image reference.
              </p>
            </div>
            {computeMessage && <div className="action-message deployment-message">{computeMessage}</div>}
            <section className="panel">
              <div className="panel-head">
                <div><h3>Your virtual machines</h3><p>Actions are sent to the assigned provider host and reflected when the agent confirms them.</p></div>
                <button onClick={loadCompute}>Refresh <RotateCcw size={13} /></button>
              </div>
              {computeInstances.length ? computeInstances.map((vm: any) => (
                <div className="table-row" key={vm.id}>
                  <Cpu size={18} />
                  <div className="flex-1">
                    <b>{vm.name}</b>
                    <small>{vm.provider} · {vm.region || 'Any region'} · {vm.vcpus} vCPU · {vm.memoryMiB} MiB · {vm.diskGiB} GiB</small>
                    <small>{vm.ipv4?.length ? `IPv4: ${vm.ipv4.join(', ')}` : vm.errorMessage || vm.image}</small>
                  </div>
                  {vm.status === 'running' && vm.ipv4?.[0] && vm.sshPublicKey && (
                    <Button kind="light" onClick={() => copySshCommand(vm.ipv4[0])}>Copy SSH</Button>
                  )}
                  <span className={`pill ${vm.status === 'running' ? 'pill-green' : 'pill-muted'}`}>{vm.status}</span>
                  {vm.status === 'stopped' && <Button kind="light" onClick={() => computeInstanceAction(vm.id, 'start')}>Start</Button>}
                  {vm.status === 'running' && <Button kind="light" onClick={() => computeInstanceAction(vm.id, 'stop')}>Stop</Button>}
                  {!['provisioning','starting','stopping','deleting','deleted'].includes(vm.status) && <Button kind="light" onClick={() => computeInstanceAction(vm.id, 'delete')}><Trash2 size={13} /> Delete</Button>}
                  {vm.provider !== 'firecracker' && ['running','stopped'].includes(vm.status) && (
                    <Button kind="light" onClick={() => createComputeSnapshot(vm.id)}>Snapshot <Plus size={13} /></Button>
                  )}
                  <div className="deployment-history deployment-wide">
                    <b>Snapshots</b>
                    {(computeSnapshots[vm.id] || []).length ? (computeSnapshots[vm.id] || []).map((snapshot: any) => (
                      <div className="table-row" key={snapshot.id}>
                        <Boxes size={15} />
                        <div className="flex-1"><b>{snapshot.name}</b><small>{snapshot.status} · {new Date(snapshot.createdAt).toLocaleString()}</small></div>
                        {snapshot.status === 'ready' && vm.status === 'stopped' && <Button kind="light" onClick={() => restoreComputeSnapshot(snapshot.id)}>Restore</Button>}
                        {snapshot.status === 'ready' && <Button kind="light" onClick={() => deleteComputeSnapshot(snapshot.id)}><Trash2 size={13} /></Button>}
                      </div>
                    )) : <p className="deployment-muted">No snapshots created.</p>}
                  </div>
                </div>
              )) : (
                <div className="deployment-empty"><b>No virtual machines yet.</b><p>Create a VM above when a Kestrel provider host is online and has capacity.</p></div>
              )}
            </section>
          </div>
        )}

        {/* SANDBOXES */}
        {page === 'sandboxes' && !inspectedRun && (
          <div className="page-content">
            <PageHeading
              eyebrow="INFRASTRUCTURE / ISOLATED COMPUTE"
              title="Sandbox workspaces"
              desc="Create disposable, isolated Linux microVM environments for development and testing. This pool is managed by Kestrel and does not require a host server."
            />
            {sandboxQuota && (
              <div className="metric-grid">
                {[
                  { label: 'Sandboxes', used: sandboxQuota.usedSandboxes || 0, max: sandboxQuota.maxSandboxes, unit: '' },
                  { label: 'vCPU', used: sandboxQuota.usedVcpu || 0, max: sandboxQuota.maxVcpu, unit: '' },
                  { label: 'Session limit', used: '—', max: Math.round(sandboxQuota.maxRuntimeSeconds / 60), unit: ' min' },
                ].map((item) => (
                  <div className="metric-card" key={item.label}>
                    <div><span>{item.label}</span><TerminalSquare size={16} /></div>
                    <strong>{item.used}{item.unit}</strong>
                    <small>Limit: {item.max}{item.unit}</small>
                  </div>
                ))}
              </div>
            )}
            <section className="panel">
              <div className="panel-head">
                <div><h3>Provision a sandbox</h3><p>Managed Linux microVM. Workspace data persists when stopped and resumed.</p></div>
                <span className="pill pill-muted">MANAGED PROVIDER</span>
              </div>
              <form className="deployment-form-grid" onSubmit={createSandbox}>
                <label>Workspace name
                  <input value={sandboxName} onChange={(e) => setSandboxName(e.target.value.toLowerCase())} pattern="[a-z0-9][a-z0-9-]{0,61}[a-z0-9]" minLength={1} maxLength={63} required />
                </label>
                <label>CPU
                  <select value={sandboxVcpus} onChange={(e) => setSandboxVcpus(e.target.value)}>
                    <option value="1">1 vCPU · 2 GiB RAM</option>
                    <option value="2">2 vCPU · 4 GiB RAM</option>
                    <option value="4">4 vCPU · 8 GiB RAM</option>
                  </select>
                </label>
                <label>Region
                  <select value={sandboxRegion} onChange={(e) => setSandboxRegion(e.target.value)}>
                    <option value="iad1">US East (Washington)</option>
                    <option value="fra1">Frankfurt</option>
                    <option value="lhr1">London</option>
                    <option value="cpt1">Cape Town</option>
                    <option value="sfo1">US West (San Francisco)</option>
                    <option value="sin1">Singapore</option>
                  </select>
                </label>
                <label>Session timeout
                  <select value={sandboxTimeout} onChange={(e) => setSandboxTimeout(e.target.value)}>
                    <option value="300">5 minutes</option>
                    <option value="900">15 minutes</option>
                    <option value="1800">30 minutes</option>
                    <option value="2700">45 minutes (maximum on Hobby)</option>
                  </select>
                </label>
                <div className="deployment-wide">
                  <Button type="submit" disabled={sandboxBusy || !organizationId}>
                    {sandboxBusy ? 'Provisioning…' : 'Create sandbox'} <Plus size={14} />
                  </Button>
                </div>
              </form>
              <p className="deployment-muted">Provider usage limits apply. Kestrel currently does not bill or meter sandbox usage.</p>
            </section>
            {sandboxMessage && <div className="action-message deployment-message">{sandboxMessage}</div>}
            <section className="panel">
              <div className="panel-head">
                <div><h3>Your sandbox environments</h3><p>Start, stop or delete environments. Commands run inside the isolated sandbox.</p></div>
                <button onClick={loadSandboxes}>Refresh <RotateCcw size={13} /></button>
              </div>
              {sandboxInstances.length ? sandboxInstances.map((box: any) => (
                <div className="table-row" key={box.id}>
                  <TerminalSquare size={18} />
                  <div className="flex-1">
                    <b>{box.name}</b>
                    <small>{box.provider} · {box.region} · {box.vcpus} vCPU · {box.memoryMiB / 1024} GiB RAM · {Math.round(box.timeoutSeconds / 60)} min</small>
                    <small>{box.lastActivityAt ? `Last activity ${new Date(box.lastActivityAt).toLocaleString()}` : ''}{box.errorMessage ? ` · ${box.errorMessage}` : ''}</small>
                  </div>
                  <span className={`pill ${box.status === 'running' ? 'pill-green' : 'pill-muted'}`}>{box.status}</span>
                  {box.status === 'stopped' && <Button kind="light" onClick={() => sandboxAction(box.id, 'start')}>Resume</Button>}
                  {box.status === 'running' && <Button kind="light" onClick={() => sandboxAction(box.id, 'stop')}>Stop</Button>}
                  {!['provisioning','stopping','deleting'].includes(box.status) && <Button kind="light" onClick={() => deleteSandbox(box.id)}><Trash2 size={13} /> Delete</Button>}
                  {box.status === 'running' && (
                    <div className="deployment-history deployment-wide">
                      <form className="deployment-release-actions" onSubmit={(e) => { e.preventDefault(); executeSandboxCommand(box.id); }}>
                        <input value={sandboxCommands[box.id] || ''} onChange={(e) => setSandboxCommands((current) => ({ ...current, [box.id]: e.target.value }))} placeholder="Run a command, e.g. node --version" />
                        <Button type="submit" disabled={!!sandboxResults[box.id]?.busy || !(sandboxCommands[box.id] || '').trim()}>Run <Play size={13} /></Button>
                      </form>
                      {sandboxResults[box.id] && (
                        <pre className="sandbox-output"><span>Exit code: {sandboxResults[box.id].exitCode ?? (sandboxResults[box.id].busy ? 'Running…' : 'Error')}</span>{sandboxResults[box.id].output}</pre>
                      )}
                    </div>
                  )}
                </div>
              )) : (
                <div className="deployment-empty"><b>No sandbox workspaces yet.</b><p>Provision one above. Sandbox creation requires Kestrel's provider credentials to be configured.</p></div>
              )}
            </section>
          </div>
        )}

        {/* ARTIFACTS */}
        {page === 'artifacts' && !inspectedRun && (
          <div className="page-content">
            <PageHeading
              eyebrow="WORKSPACE / ARTIFACTS"
              title="Build Artifacts"
              desc="Build outputs, packages and reports from your pipeline runs."
            />
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h3>Stored Build Outputs</h3>
                  <p>Artifacts are tied directly to the pipeline run that generated them.</p>
                </div>
              </div>
              {snapshot?.artifacts?.length ? (
                snapshot.artifacts.map((a: any) => (
                  <div className="table-row" key={a.id}>
                    <Boxes size={18} />
                    <div className="flex-1">
                      <b>{a.name || a.id}</b>
                      <small>
                        Run: {String(a.runId).slice(0, 8)} · Size: {(a.sizeBytes / 1024).toFixed(1)} KB · Content:{' '}
                        {a.contentType || 'application/octet-stream'}
                      </small>
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">
                      {new Date(a.createdAt).toLocaleDateString()}
                      {a.expiresAt ? ` · Expires ${new Date(a.expiresAt).toLocaleDateString()}` : ' · No expiry'}
                    </span>
                    <button className="outline-button" onClick={() => downloadArtifact(a.id)} title="Download artifact">
                      <ArrowDownRight size={15} /> Download
                    </button>
                    <button className="outline-button" onClick={() => deleteArtifact(a.id)} title="Delete artifact">
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                ))
              ) : (
                <Empty
                  icon={Boxes}
                  title="No artifacts collected"
                  desc="Artifacts produced in dist/ or build/ directories will appear here when completed."
                />
              )}
              {actionMessage && <div className="action-message">{actionMessage}</div>}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {page === 'settings' && !inspectedRun && (
          <div className="page-content">
            <PageHeading
              eyebrow="MANAGE / SETTINGS"
              title="Workspace Settings"
              desc="Connection parameters and platform authentication details."
            />
            <div className="panel settings-panel">
              <h3>Connection Status</h3>
              <p>Authentication is handled via Supabase Auth tokens; worker communication is signed.</p>
              <div className="system-status">
                <div>
                  <span>Control Plane API</span>
                  <b>{api}</b>
                </div>
                <div>
                  <span>Active Workspace UUID</span>
                  <b>{organizationId || 'Not connected'}</b>
                </div>
                <div>
                  <span>Tenant Isolation</span>
                  <b>Enforced via Postgres RLS &amp; JWT</b>
                </div>
              </div>
              <Button onClick={connect}>
                {loading ? 'Reconnecting…' : 'Verify connection'} <ArrowRight size={15} />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function PageHeading({ eyebrow, title, desc }: any) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function Empty({ icon: Icon, title, desc, action, onClick }: any) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={21} />
      </div>
      <b>{title}</b>
      <p>{desc}</p>
      {action && (
        <button onClick={onClick}>
          {action} <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}

function InfoPage({ page }: { page: 'docs' | 'pricing' }) {
  return (
    <div className="marketing">
      <header className="marketing-nav wrap">
        <Brand />
        <nav>
          <button onClick={() => go('home')}>Platform</button>
          <button onClick={() => go('docs')}>Documentation</button>
          <button onClick={() => go('pricing')}>Pricing</button>
        </nav>
        <div className="nav-actions">
          <button className="login-link" onClick={() => go('login')}>
            Log in
          </button>
          <Button onClick={() => go('signup')}>
            Get started <ArrowRight size={15} />
          </Button>
        </div>
      </header>
      <section className="info-hero wrap">
        <div className="eyebrow">KESTREL / {page.toUpperCase()}</div>
        <h1>{page === 'docs' ? 'Understand the system.' : 'Start small. Scale your workers.'}</h1>
        <p>
          {page === 'docs'
            ? 'A complete guide to connecting repositories, configuring the control plane, running isolated workers, and setting up webhooks.'
            : 'Build with your own control plane and add execution capacity across your own machines as workloads grow.'}
        </p>
      </section>
      <section className="info-cards wrap">
        {(page === 'docs'
          ? [
              ['01', 'Control plane', 'Deploy the Express API to Vercel or Node.js with Supabase PostgreSQL.'],
              ['02', 'Connect workers', 'Run worker/agent.mjs on Linux with Docker socket access and worker token.'],
              ['03', 'Register projects', 'Add Git repo, configure AES-256 secrets, and enable signed GitHub webhooks.'],
              ['04', 'Pipeline execution', 'Define DAG job dependencies and watch streaming logs in real time.'],
            ]
          : [
              ['COMMUNITY', 'Local development', 'Run Kestrel locally and evaluate the containerized workflow.'],
              ['SELF-HOSTED', 'Your infrastructure', 'Run the control plane and workers on machines you manage.'],
              ['ENTERPRISE', 'Scale execution', 'Add worker fleets horizontally with zero lock-in.'],
            ]
        ).map((x) => (
          <article className="info-card" key={x[0]}>
            <small>{x[0]}</small>
            <h3>{x[1]}</h3>
            <p>{x[2]}</p>
          </article>
        ))}
      </section>
      <Footer />
    </div>
  );
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const f = () => setPath(window.location.pathname);
    window.addEventListener('popstate', f);
    return () => window.removeEventListener('popstate', f);
  }, []);

  const page = (path.replace(/^\//, '') || 'home') as Page;
  if (page === 'admin/login' || page === 'admin') return <Admin />;
  if (page === 'home') return <Landing />;
  if (page === 'login' || page === 'signup') return <Auth mode={page} />;
  if (page === 'docs' || page === 'pricing') return <InfoPage page={page} />;
  if (nav.some((n) => n.id === page)) return <AppShell page={page} />;
  return <Landing />;
}
