import type { LegalContent } from "@/components/legal-doc";

const gh = (label: string) => (
  <a
    href="https://github.com/YueMiyuki/Risuko"
    target="_blank"
    rel="noreferrer"
  >
    {label}
  </a>
);

export const privacyContent: LegalContent = {
  en: {
    title: "Privacy Policy",
    updated: "July 4, 2026",
    intro:
      "Risuko keeps your activity on your device, with no telemetry. Accounts, cloud sync, and file sharing are optional — here's exactly what each one touches, and what never leaves your machine.",
    sections: [
      {
        id: "overview",
        icon: "shield",
        title: "Overview",
        summary:
          "Risuko runs on your device. It has no analytics or telemetry. A few optional features use an account and our server — this policy covers exactly what they touch.",
        body: (
          <>
            <p>
              Risuko is local-first: by default it works entirely on your
              machine and sends us nothing. The app contains{" "}
              <strong>no analytics, tracking, or crash reporting</strong>.
            </p>
            <p>
              Three optional features — <strong>an account</strong>,{" "}
              <strong>cloud sync</strong>, and <strong>file sharing</strong> —
              use our backend at <code>api.risuko.app</code>. Downloading itself
              connects to the sources you choose. Everything below explains what
              data each of these involves.
            </p>
          </>
        ),
      },
      {
        id: "account",
        icon: "user",
        title: "Your Account",
        summary:
          "Optional — only needed for cloud sync or file sharing. We store your email or GitHub identity, never a password.",
        body: (
          <>
            <p>
              Creating an account is optional. You can sign in with your{" "}
              <strong>email</strong> (we send a one-time code) or with{" "}
              <strong>GitHub</strong> (which shares your GitHub ID, username,
              and email address via the <code>read:user user:email</code>{" "}
              scope).
            </p>
            <p>
              We store your email address, or your GitHub ID and username, plus
              short-lived login codes and session tokens (sessions last about 30
              days). We never receive or store a password. Your IP address is
              read transiently from request headers for rate-limiting and is not
              saved to a database.
            </p>
          </>
        ),
      },
      {
        id: "on-device",
        icon: "lock",
        title: "What Stays on Your Device",
        summary:
          "Your downloads, task history, settings, imported cookies, and saved credentials live on your computer.",
        body: (
          <>
            <p>
              The files you download, your task history, and your settings are
              stored locally. Saved credentials (site logins, cloud-upload keys)
              are kept in your operating system's secure keychain — Keychain on
              macOS, Credential Manager on Windows, Secret Service on Linux.
            </p>
            <p>
              The <strong>Clipboard Watcher</strong>, when enabled, reads your
              clipboard only on your device to spot download links; contents are
              never sent anywhere and it can be turned off in Settings. If no
              system keychain is available, secrets fall back to a local config
              file — see Cloud Sync for why that matters.
            </p>
          </>
        ),
      },
      {
        id: "downloading",
        icon: "download",
        title: "Downloading",
        summary:
          "Downloads connect directly to the sources you choose. Peer-to-peer protocols like BitTorrent expose your IP address to other peers.",
        body: (
          <>
            <p>
              When you download, Risuko connects directly to the URLs, trackers,
              and peers you provide — over HTTP(S), FTP/SFTP, BitTorrent, ED2K,
              HLS, and others. Those third-party hosts see your IP address and
              requests; we are not involved.
            </p>
            <p>
              <strong>
                BitTorrent and other peer-to-peer protocols are public by design
              </strong>
              : your IP address and the content identifiers (info hashes) are
              shared with trackers, the DHT, local-network peers, and other
              downloaders, and Risuko uploads (seeds) to them. Media downloads
              may launch an external <code>yt-dlp</code> you have installed.
            </p>
          </>
        ),
      },
      {
        id: "cloud-sync",
        icon: "cloud",
        title: "Cloud Sync",
        summary:
          "Off by default. The setting categories you pick are stored on our server. Some categories can contain secrets — enable those only if you accept that.",
        body: (
          <>
            <p>
              Cloud sync is{" "}
              <strong>off unless you sign in and enable it</strong>, and it is{" "}
              <strong>selectable per category</strong>. The categories you
              choose are uploaded to our backend (<code>api.risuko.app</code>,
              on Cloudflare D1) and associated with your account. We store only
              those settings and their timestamps.
            </p>
            <p>
              Be aware that{" "}
              <strong>some categories can contain sensitive values</strong> —
              proxy settings and cookie headers, FTP/SFTP passwords, SSH private
              keys, and RPC secrets. When such a secret is held in your OS
              keychain it stays out of sync; if it is stored inline (for
              example, on a system without a keychain) and you enable that
              category, it is transmitted to and stored on our server as part of
              the settings blob. Enable only the categories you're comfortable
              syncing. You can disable sync or delete your synced data at any
              time.
            </p>
          </>
        ),
      },
      {
        id: "file-sharing",
        icon: "share",
        title: "File Sharing",
        summary:
          "Files transfer directly, end-to-end encrypted, device to device — never through us. Our server only holds a one-hour rendezvous so devices can connect.",
        body: (
          <>
            <p>
              Risuko's file sharing is <strong>peer-to-peer</strong> (built on
              iroh): the file moves directly between devices and is{" "}
              <strong>never uploaded to us</strong>. To connect two devices, our
              server briefly stores a rendezvous record — a pairing code, a
              connection ticket, and basic file metadata (names and sizes).
              These records expire after about an hour and are single-use.
            </p>
            <p>
              The connection ticket includes the sender's network address, so
              whoever holds the code (and our rendezvous record) can see it.
              When a direct connection can't be made, the encrypted transfer
              falls back through public relay servers operated by{" "}
              <strong>n0</strong> (the iroh project); relays carry only
              encrypted bytes and cannot read your files.
            </p>
          </>
        ),
      },
      {
        id: "cookie-import",
        icon: "cookie",
        title: "Browser Cookie Import",
        summary:
          "Optional. Reads cookies from your local browser to pass to a download — stays on your device, not sent to us.",
        body: (
          <p>
            To download from sites that require a login or bot check, you can
            import cookies that Risuko reads directly from your installed
            browser's local cookie database (Chrome, Firefox, Edge, Brave,
            Safari, and others). Decrypting them may prompt your OS keychain or
            ask for elevation. Imported cookies are stored locally and used only
            for your downloads — they are not sent to our servers (though the
            generic cookie field is one of the syncable categories described
            above).
          </p>
        ),
      },
      {
        id: "updates",
        icon: "refresh",
        title: "Updates, Trackers & Website",
        summary:
          "The app can check for updates; the tracker list refreshes from public CDNs; the website uses aggregate analytics. None of this is tied to your account.",
        body: (
          <p>
            If enabled, Risuko checks for updates from{" "}
            <code>risuko.vercel.app</code>, sending your app version, operating
            system, and architecture. The optional BitTorrent tracker list
            refreshes from public CDNs (GitHub / jsDelivr). Our marketing
            website uses privacy-friendly, aggregate analytics; the app does
            not. None of this is linked to any account.
          </p>
        ),
      },
      {
        id: "never-collect",
        icon: "eye-off",
        title: "What We Never Collect",
        summary:
          "No telemetry, no ads, and never the contents of your downloads, clipboard, or shared files.",
        body: (
          <p>
            The app contains no analytics, usage tracking, or crash reporting.
            Even with an account, we never collect the contents or names of the
            files you download, the text on your clipboard, the contents of
            files you share (transfers are peer-to-peer), the sites you browse,
            or any advertising profile. Risuko shows no ads.
          </p>
        ),
      },
      {
        id: "providers",
        icon: "server",
        title: "Service Providers",
        summary:
          "Cloudflare hosts our backend; GitHub provides sign-in; a few features contact other third parties.",
        body: (
          <p>
            Our account, sync, and sharing backend runs on{" "}
            <strong>Cloudflare</strong> (Workers, the D1 database, and email
            delivery for login codes). <strong>GitHub</strong> provides optional
            OAuth sign-in and hosts release downloads. Update checks use{" "}
            <strong>Vercel</strong> (which also serves the website and its
            analytics), peer-to-peer relays use <strong>n0</strong>, and the
            tracker list comes from public CDNs. Downloads, cloud-upload
            destinations you configure, and media sites all involve the third
            parties you point Risuko at. Each operates under its own privacy
            practices.
          </p>
        ),
      },
      {
        id: "retention",
        icon: "clock",
        title: "Data Retention",
        summary:
          "Login codes and share rendezvous expire within minutes to an hour; your account and synced settings stay until you delete them.",
        body: (
          <p>
            One-time login codes and file-sharing rendezvous records are
            short-lived and purged automatically. Login sessions expire on their
            own. Your account record and any synced settings are kept until you
            delete them or close your account.
          </p>
        ),
      },
      {
        id: "controls",
        icon: "file-check",
        title: "Your Controls",
        summary:
          "Every network feature is optional and reversible. Keep secrets in your keychain to keep them out of sync.",
        body: (
          <p>
            Cloud sync, file sharing, browser-cookie import, update checks,
            tracker sync, and DNS-over-HTTPS are all optional and can be turned
            off in Settings. Storing credentials in your OS keychain keeps them
            off cloud sync entirely. You can clear Risuko's local data by
            removing its configuration directory or uninstalling, and remove
            your synced data or account by signing out or contacting us to
            delete your server-side records.
          </p>
        ),
      },
      {
        id: "contact",
        icon: "mail",
        title: "Contact & Changes",
        summary:
          "Questions, or want your data removed? Reach the project on GitHub. We'll update this page and its date when practices change.",
        body: (
          <p>
            We may update this policy as Risuko evolves; changes are reflected
            by the “last updated” date above. Questions or data-removal requests
            can be raised on the project's {gh("GitHub repository")}.
          </p>
        ),
      },
    ],
  },

  "zh-CN": {
    title: "隐私政策",
    updated: "2026年7月4日",
    intro:
      "Risuko 将你的活动保留在你的设备上，且不含任何遥测。账户、云同步和文件分享均为可选功能——以下详述每项功能涉及哪些数据，以及哪些数据永不离开你的设备。",
    sections: [
      {
        id: "overview",
        icon: "shield",
        title: "概述",
        summary:
          "Risuko 在你的设备上运行，不含分析或遥测。少数可选功能会使用账户和我们的服务器——本政策详述它们涉及哪些数据。",
        body: (
          <>
            <p>
              Risuko
              以本地优先为原则：默认情况下它完全在你的设备上运行，不向我们发送任何数据。应用
              <strong>不含任何分析、追踪或崩溃报告</strong>。
            </p>
            <p>
              三项可选功能——<strong>账户</strong>、<strong>云同步</strong>和
              <strong>文件分享</strong>——会使用我们位于{" "}
              <code>api.risuko.app</code>{" "}
              的后端。下载本身则连接到你选择的来源。以下说明每项功能涉及的数据。
            </p>
          </>
        ),
      },
      {
        id: "account",
        icon: "user",
        title: "你的账户",
        summary:
          "可选——仅云同步或文件分享需要。我们存储你的邮箱或 GitHub 身份，绝不存储密码。",
        body: (
          <>
            <p>
              创建账户是可选的。你可使用<strong>邮箱</strong>
              （我们会发送一次性验证码）或 <strong>GitHub</strong>（通过{" "}
              <code>read:user user:email</code> 权限范围获取你的 GitHub
              ID、用户名和邮箱）登录。
            </p>
            <p>
              我们存储你的邮箱地址，或你的 GitHub ID
              和用户名，以及短期有效的登录验证码和会话令牌（会话有效期约 30
              天）。我们绝不接收或存储密码。你的 IP
              地址仅从请求头中临时读取以用于限流，不会写入数据库。
            </p>
          </>
        ),
      },
      {
        id: "on-device",
        icon: "lock",
        title: "留在你设备上的数据",
        summary:
          "你的下载、任务历史、设置、导入的 Cookie 和已保存的凭据都在你的电脑上。",
        body: (
          <>
            <p>
              你下载的文件、任务历史和设置都存储在本地。已保存的凭据（网站登录、云上传密钥）保存在你操作系统的安全密钥库中——macOS
              上的钥匙串、Windows 上的凭据管理器、Linux 上的 Secret Service。
            </p>
            <p>
              <strong>剪贴板监视器</strong>
              启用后，仅在你的设备上读取剪贴板以识别下载链接；内容绝不发送到任何地方，且可在设置中关闭。若系统没有可用的密钥库，密钥会退回到本地配置文件——原因请见云同步一节。
            </p>
          </>
        ),
      },
      {
        id: "downloading",
        icon: "download",
        title: "下载",
        summary:
          "下载会直接连接到你选择的来源。BitTorrent 等点对点协议会向其他对等节点暴露你的 IP 地址。",
        body: (
          <>
            <p>
              下载时，Risuko 会直接连接到你提供的 URL、Tracker 和对等节点——通过
              HTTP(S)、FTP/SFTP、BitTorrent、ED2K、HLS
              等协议。这些第三方主机会看到你的 IP 地址和请求；我们并不参与其中。
            </p>
            <p>
              <strong>BitTorrent 及其他点对点协议在设计上是公开的</strong>：你的
              IP 地址和内容标识（info hash）会与
              Tracker、DHT、局域网内的对等节点及其他下载者共享，Risuko
              也会向它们上传（做种）。媒体下载可能会调用你已安装的外部{" "}
              <code>yt-dlp</code>。
            </p>
          </>
        ),
      },
      {
        id: "cloud-sync",
        icon: "cloud",
        title: "云同步",
        summary:
          "默认关闭。你选择的设置类别会存储在我们的服务器上。部分类别可能包含机密信息——请仅在你接受这一点时才启用。",
        body: (
          <>
            <p>
              云同步<strong>只有在你登录并启用后</strong>才生效，且
              <strong>可按类别单独选择</strong>
              。你选择的类别会上传到我们的后端（<code>api.risuko.app</code>
              ，运行于 Cloudflare
              D1）并与你的账户关联。我们仅存储这些设置及其时间戳。
            </p>
            <p>
              请注意，<strong>部分类别可能包含敏感值</strong>——代理设置和 Cookie
              头、FTP/SFTP 密码、SSH 私钥以及 RPC
              密钥。当此类机密保存在你的操作系统密钥库中时，它不会被同步；若它以明文形式内联存储（例如在没有密钥库的系统上）而你又启用了该类别，则它会作为设置数据的一部分被传输并存储到我们的服务器上。请仅启用你愿意同步的类别。你可随时禁用同步或删除已同步的数据。
            </p>
          </>
        ),
      },
      {
        id: "file-sharing",
        icon: "share",
        title: "文件分享",
        summary:
          "文件在设备之间直接传输并端到端加密——绝不经过我们。我们的服务器仅保留一个约一小时的会合记录，供设备建立连接。",
        body: (
          <>
            <p>
              Risuko 的文件分享是<strong>点对点</strong>的（基于
              iroh）：文件在设备之间直接传输，
              <strong>绝不上传到我们这里</strong>
              。为连接两台设备，我们的服务器会短暂存储一条会合记录——配对码、连接凭据（ticket）和基本文件元数据（名称和大小）。这些记录约一小时后过期，且仅可使用一次。
            </p>
            <p>
              连接凭据包含发送方的网络地址，因此持有配对码（以及我们的会合记录）的人可以看到它。当无法建立直连时，加密传输会退回经由{" "}
              <strong>n0</strong>（iroh
              项目）运营的公共中继服务器；中继仅承载加密字节，无法读取你的文件。
            </p>
          </>
        ),
      },
      {
        id: "cookie-import",
        icon: "cookie",
        title: "浏览器 Cookie 导入",
        summary:
          "可选。从你本地浏览器读取 Cookie 以用于下载——保留在你的设备上，不发送给我们。",
        body: (
          <p>
            为了从需要登录或机器人验证的网站下载，你可以导入 Cookie，Risuko
            会直接从你已安装浏览器的本地 Cookie
            数据库（Chrome、Firefox、Edge、Brave、Safari
            等）读取。解密时可能会提示你的操作系统密钥库或要求提权。导入的
            Cookie
            存储在本地，仅用于你的下载——它们不会发送到我们的服务器（不过上文所述的通用
            Cookie 字段是可同步的类别之一）。
          </p>
        ),
      },
      {
        id: "updates",
        icon: "refresh",
        title: "更新、Tracker 与网站",
        summary:
          "应用可检查更新；Tracker 列表从公共 CDN 刷新；网站使用聚合分析。这些都不与你的账户关联。",
        body: (
          <p>
            若启用，Risuko 会向 <code>risuko.vercel.app</code>{" "}
            检查更新，并发送你的应用版本、操作系统和架构。可选的 BitTorrent
            Tracker 列表会从公共 CDN（GitHub /
            jsDelivr）刷新。我们的营销网站使用注重隐私的聚合分析；应用则不使用。以上均不与任何账户关联。
          </p>
        ),
      },
      {
        id: "never-collect",
        icon: "eye-off",
        title: "我们绝不收集的内容",
        summary:
          "没有遥测、没有广告，也绝不收集你下载、剪贴板或分享文件的内容。",
        body: (
          <p>
            应用不含任何分析、使用情况追踪或崩溃报告。即使拥有账户，我们也绝不收集你下载文件的内容或名称、剪贴板上的文本、你分享文件的内容（传输为点对点）、你浏览的网站，或任何广告画像。Risuko
            不展示广告。
          </p>
        ),
      },
      {
        id: "providers",
        icon: "server",
        title: "服务提供商",
        summary:
          "Cloudflare 托管我们的后端；GitHub 提供登录；少数功能会联系其他第三方。",
        body: (
          <p>
            我们的账户、同步和分享后端运行在 <strong>Cloudflare</strong>
            （Workers、D1 数据库以及用于发送登录验证码的邮件服务）上。
            <strong>GitHub</strong> 提供可选的 OAuth
            登录并托管版本下载。更新检查使用 <strong>Vercel</strong>
            （其同时提供网站及其分析），点对点中继使用 <strong>n0</strong>
            ，Tracker 列表来自公共
            CDN。下载、你配置的云上传目标以及媒体站点都涉及你所指向的第三方。各方均按其各自的隐私规范运作。
          </p>
        ),
      },
      {
        id: "retention",
        icon: "clock",
        title: "数据保留",
        summary:
          "登录验证码和分享会合记录会在数分钟至一小时内过期；你的账户和已同步的设置会保留到你删除为止。",
        body: (
          <p>
            一次性登录验证码和文件分享会合记录都是短期的，会自动清除。登录会话会自行过期。你的账户记录和任何已同步的设置会一直保留，直到你删除它们或注销账户。
          </p>
        ),
      },
      {
        id: "controls",
        icon: "file-check",
        title: "你的控制权",
        summary:
          "每项联网功能都是可选且可逆的。将机密保存在密钥库中即可使其不被同步。",
        body: (
          <p>
            云同步、文件分享、浏览器 Cookie 导入、更新检查、Tracker 同步和 DNS
            over HTTPS
            均为可选，且可在设置中关闭。将凭据保存在操作系统密钥库中可使其完全不进入云同步。你可通过删除
            Risuko
            的配置目录或卸载来清除本地数据，并通过注销或联系我们删除服务器端记录来移除你已同步的数据或账户。
          </p>
        ),
      },
      {
        id: "contact",
        icon: "mail",
        title: "联系方式与变更",
        summary:
          "有疑问，或希望删除数据？请在 GitHub 上联系项目。当规范变更时，我们会更新本页面及其日期。",
        body: (
          <p>
            我们可能随 Risuko
            的演进更新本政策；变更将通过上方的“最后更新”日期体现。有关问题或数据删除请求可在项目的{" "}
            {gh("GitHub 仓库")} 提出。
          </p>
        ),
      },
    ],
  },

  "zh-TW": {
    title: "隱私政策",
    updated: "2026年7月4日",
    intro:
      "Risuko 將你的活動保留在你的裝置上，且不含任何遙測。帳戶、雲端同步與檔案分享皆為選用功能——以下詳述每項功能涉及哪些資料，以及哪些資料永不離開你的裝置。",
    sections: [
      {
        id: "overview",
        icon: "shield",
        title: "概述",
        summary:
          "Risuko 在你的裝置上運行，不含分析或遙測。少數選用功能會使用帳戶與我們的伺服器——本政策詳述它們涉及哪些資料。",
        body: (
          <>
            <p>
              Risuko
              以本地優先為原則：預設情況下它完全在你的裝置上運行，不向我們傳送任何資料。應用程式
              <strong>不含任何分析、追蹤或當機報告</strong>。
            </p>
            <p>
              三項選用功能——<strong>帳戶</strong>、<strong>雲端同步</strong>與
              <strong>檔案分享</strong>——會使用我們位於{" "}
              <code>api.risuko.app</code>{" "}
              的後端。下載本身則連接到你選擇的來源。以下說明每項功能涉及的資料。
            </p>
          </>
        ),
      },
      {
        id: "account",
        icon: "user",
        title: "你的帳戶",
        summary:
          "選用——僅雲端同步或檔案分享需要。我們儲存你的電子郵件或 GitHub 身分，絕不儲存密碼。",
        body: (
          <>
            <p>
              建立帳戶是選用的。你可使用<strong>電子郵件</strong>
              （我們會傳送一次性驗證碼）或 <strong>GitHub</strong>（透過{" "}
              <code>read:user user:email</code> 權限範圍取得你的 GitHub
              ID、使用者名稱與電子郵件）登入。
            </p>
            <p>
              我們儲存你的電子郵件地址，或你的 GitHub ID
              與使用者名稱，以及短期有效的登入驗證碼與工作階段權杖（工作階段有效期約
              30 天）。我們絕不接收或儲存密碼。你的 IP
              位址僅從請求標頭中暫時讀取以用於限流，不會寫入資料庫。
            </p>
          </>
        ),
      },
      {
        id: "on-device",
        icon: "lock",
        title: "留在你裝置上的資料",
        summary:
          "你的下載、工作歷史、設定、匯入的 Cookie 與已儲存的憑證都在你的電腦上。",
        body: (
          <>
            <p>
              你下載的檔案、工作歷史與設定都儲存在本地。已儲存的憑證（網站登入、雲端上傳金鑰）保存在你作業系統的安全金鑰庫中——macOS
              上的鑰匙圈、Windows 上的認證管理員、Linux 上的 Secret Service。
            </p>
            <p>
              <strong>剪貼簿監視器</strong>
              啟用後，僅在你的裝置上讀取剪貼簿以識別下載連結；內容絕不傳送到任何地方，且可在設定中關閉。若系統沒有可用的金鑰庫，機密會退回到本地設定檔——原因請見雲端同步一節。
            </p>
          </>
        ),
      },
      {
        id: "downloading",
        icon: "download",
        title: "下載",
        summary:
          "下載會直接連接到你選擇的來源。BitTorrent 等點對點協定會向其他對等節點暴露你的 IP 位址。",
        body: (
          <>
            <p>
              下載時，Risuko 會直接連接到你提供的 URL、Tracker 與對等節點——透過
              HTTP(S)、FTP/SFTP、BitTorrent、ED2K、HLS
              等協定。這些第三方主機會看到你的 IP 位址與請求；我們並不參與其中。
            </p>
            <p>
              <strong>BitTorrent 及其他點對點協定在設計上是公開的</strong>：你的
              IP 位址與內容識別碼（info hash）會與
              Tracker、DHT、區域網路內的對等節點及其他下載者共用，Risuko
              也會向它們上傳（做種）。媒體下載可能會呼叫你已安裝的外部{" "}
              <code>yt-dlp</code>。
            </p>
          </>
        ),
      },
      {
        id: "cloud-sync",
        icon: "cloud",
        title: "雲端同步",
        summary:
          "預設關閉。你選擇的設定類別會儲存在我們的伺服器上。部分類別可能包含機密資訊——請僅在你接受這一點時才啟用。",
        body: (
          <>
            <p>
              雲端同步<strong>只有在你登入並啟用後</strong>才生效，且
              <strong>可按類別個別選擇</strong>
              。你選擇的類別會上傳到我們的後端（<code>api.risuko.app</code>
              ，運行於 Cloudflare
              D1）並與你的帳戶關聯。我們僅儲存這些設定及其時間戳記。
            </p>
            <p>
              請注意，<strong>部分類別可能包含敏感值</strong>——代理設定與 Cookie
              標頭、FTP/SFTP 密碼、SSH 私鑰以及 RPC
              金鑰。當此類機密保存在你的作業系統金鑰庫中時，它不會被同步；若它以明文形式內嵌儲存（例如在沒有金鑰庫的系統上）而你又啟用了該類別，則它會作為設定資料的一部分被傳輸並儲存到我們的伺服器上。請僅啟用你願意同步的類別。你可隨時停用同步或刪除已同步的資料。
            </p>
          </>
        ),
      },
      {
        id: "file-sharing",
        icon: "share",
        title: "檔案分享",
        summary:
          "檔案在裝置之間直接傳輸並端對端加密——絕不經過我們。我們的伺服器僅保留一個約一小時的會合記錄，供裝置建立連線。",
        body: (
          <>
            <p>
              Risuko 的檔案分享是<strong>點對點</strong>的（基於
              iroh）：檔案在裝置之間直接傳輸，
              <strong>絕不上傳到我們這裡</strong>
              。為連接兩台裝置，我們的伺服器會短暫儲存一筆會合記錄——配對碼、連線憑證（ticket）與基本檔案中繼資料（名稱與大小）。這些記錄約一小時後過期，且僅可使用一次。
            </p>
            <p>
              連線憑證包含傳送方的網路位址，因此持有配對碼（以及我們的會合記錄）的人可以看到它。當無法建立直連時，加密傳輸會退回經由{" "}
              <strong>n0</strong>（iroh
              專案）營運的公共中繼伺服器；中繼僅承載加密位元組，無法讀取你的檔案。
            </p>
          </>
        ),
      },
      {
        id: "cookie-import",
        icon: "cookie",
        title: "瀏覽器 Cookie 匯入",
        summary:
          "選用。從你本地瀏覽器讀取 Cookie 以用於下載——保留在你的裝置上，不傳送給我們。",
        body: (
          <p>
            為了從需要登入或機器人驗證的網站下載，你可以匯入 Cookie，Risuko
            會直接從你已安裝瀏覽器的本地 Cookie
            資料庫（Chrome、Firefox、Edge、Brave、Safari
            等）讀取。解密時可能會提示你的作業系統金鑰庫或要求提權。匯入的
            Cookie
            儲存在本地，僅用於你的下載——它們不會傳送到我們的伺服器（不過上文所述的通用
            Cookie 欄位是可同步的類別之一）。
          </p>
        ),
      },
      {
        id: "updates",
        icon: "refresh",
        title: "更新、Tracker 與網站",
        summary:
          "應用程式可檢查更新；Tracker 清單從公共 CDN 重新整理；網站使用彙總分析。這些都不與你的帳戶關聯。",
        body: (
          <p>
            若啟用，Risuko 會向 <code>risuko.vercel.app</code>{" "}
            檢查更新，並傳送你的應用程式版本、作業系統與架構。選用的 BitTorrent
            Tracker 清單會從公共 CDN（GitHub /
            jsDelivr）重新整理。我們的行銷網站使用注重隱私的彙總分析；應用程式則不使用。以上均不與任何帳戶關聯。
          </p>
        ),
      },
      {
        id: "never-collect",
        icon: "eye-off",
        title: "我們絕不收集的內容",
        summary:
          "沒有遙測、沒有廣告，也絕不收集你下載、剪貼簿或分享檔案的內容。",
        body: (
          <p>
            應用程式不含任何分析、使用情況追蹤或當機報告。即使擁有帳戶，我們也絕不收集你下載檔案的內容或名稱、剪貼簿上的文字、你分享檔案的內容（傳輸為點對點）、你瀏覽的網站，或任何廣告輪廓。Risuko
            不顯示廣告。
          </p>
        ),
      },
      {
        id: "providers",
        icon: "server",
        title: "服務提供商",
        summary:
          "Cloudflare 託管我們的後端；GitHub 提供登入；少數功能會聯絡其他第三方。",
        body: (
          <p>
            我們的帳戶、同步與分享後端運行在 <strong>Cloudflare</strong>
            （Workers、D1 資料庫以及用於傳送登入驗證碼的郵件服務）上。
            <strong>GitHub</strong> 提供選用的 OAuth
            登入並託管版本下載。更新檢查使用 <strong>Vercel</strong>
            （其同時提供網站及其分析），點對點中繼使用 <strong>n0</strong>
            ，Tracker 清單來自公共
            CDN。下載、你設定的雲端上傳目標以及媒體網站都涉及你所指向的第三方。各方均按其各自的隱私規範運作。
          </p>
        ),
      },
      {
        id: "retention",
        icon: "clock",
        title: "資料保留",
        summary:
          "登入驗證碼與分享會合記錄會在數分鐘至一小時內過期；你的帳戶與已同步的設定會保留到你刪除為止。",
        body: (
          <p>
            一次性登入驗證碼與檔案分享會合記錄都是短期的，會自動清除。登入工作階段會自行過期。你的帳戶記錄與任何已同步的設定會一直保留，直到你刪除它們或關閉帳戶。
          </p>
        ),
      },
      {
        id: "controls",
        icon: "file-check",
        title: "你的控制權",
        summary:
          "每項連網功能都是選用且可逆的。將機密保存在金鑰庫中即可使其不被同步。",
        body: (
          <p>
            雲端同步、檔案分享、瀏覽器 Cookie 匯入、更新檢查、Tracker 同步與 DNS
            over HTTPS
            均為選用，且可在設定中關閉。將憑證保存在作業系統金鑰庫中可使其完全不進入雲端同步。你可透過刪除
            Risuko
            的設定目錄或解除安裝來清除本地資料，並透過登出或聯絡我們刪除伺服器端記錄來移除你已同步的資料或帳戶。
          </p>
        ),
      },
      {
        id: "contact",
        icon: "mail",
        title: "聯絡方式與變更",
        summary:
          "有疑問，或希望刪除資料？請在 GitHub 上聯絡專案。當規範變更時，我們會更新本頁面及其日期。",
        body: (
          <p>
            我們可能隨 Risuko
            的演進更新本政策；變更將透過上方的「最後更新」日期體現。有關問題或資料刪除請求可在專案的{" "}
            {gh("GitHub 儲存庫")} 提出。
          </p>
        ),
      },
    ],
  },
};
