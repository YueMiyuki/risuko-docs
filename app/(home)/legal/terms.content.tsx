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

export const termsContent: LegalContent = {
  en: {
    title: "Terms of Service",
    updated: "July 4, 2026",
    intro:
      "Risuko is a free, open-source tool. These terms keep expectations clear — what you can do, and what we can't promise.",
    sections: [
      {
        id: "acceptance",
        icon: "scale",
        title: "Acceptance of Terms",
        summary:
          "Installing or using Risuko means you agree to these terms. If you don't agree, don't use it.",
        body: (
          <>
            <p>
              These Terms of Service govern your use of <strong>Risuko</strong>,
              an open-source download manager, including its desktop app,
              command-line interface, and related tools (together, the{" "}
              <strong>“Software”</strong>).
            </p>
            <p>
              By downloading, installing, or using the Software, you agree to be
              bound by these terms. If you use Risuko on behalf of an
              organization, you agree on its behalf.
            </p>
          </>
        ),
      },
      {
        id: "license",
        icon: "file-check",
        title: "License to Use",
        summary:
          "Risuko is open-source software. You're free to use, study, modify, and share it under its license.",
        body: (
          <>
            <p>
              The Software is released under its open-source license (see the{" "}
              <code>LICENSE</code> file in the project repository). That license
              — not this page — governs your rights to the source code. These
              terms cover your use of the distributed application and services.
            </p>
            <p>
              Risuko's name, logo, and branding remain the property of their
              authors and are not granted to you by the open-source license.
            </p>
          </>
        ),
      },
      {
        id: "acceptable-use",
        icon: "shield",
        title: "Acceptable Use",
        summary:
          "Risuko is a neutral tool. You alone are responsible for what you download, and must respect copyright and the law.",
        body: (
          <>
            <p>
              Risuko does not host, provide, or control any content. It simply
              transfers data from sources <strong>you</strong> choose. You are
              solely responsible for ensuring you have the right to download,
              store, share, and — over peer-to-peer protocols — redistribute
              (seed) any file you transfer with it.
            </p>
            <p>
              Do not use Risuko to infringe copyright, distribute malware, or
              violate any applicable law. We generally cannot and do not monitor
              what you download.
            </p>
          </>
        ),
      },
      {
        id: "accounts",
        icon: "user",
        title: "Accounts & Hosted Services",
        summary:
          "Cloud sync and file sharing need an account and run on our servers. Keep your login secure and use them lawfully.",
        body: (
          <>
            <p>
              Some optional features — cloud sync and file sharing — require an
              account and use our hosted backend. You are responsible for
              activity under your account and for keeping your login credentials
              secure.
            </p>
            <p>
              Do not use sharing or sync to store or distribute unlawful
              content. We may suspend accounts or remove data that violates
              these terms or the law. These hosted services are provided on a
              best-effort basis and may change or be discontinued.
            </p>
          </>
        ),
      },
      {
        id: "third-party",
        icon: "server",
        title: "Third-Party Content & Sources",
        summary:
          "Links, trackers, plugins, and servers you connect to belong to third parties we don't control or endorse.",
        body: (
          <>
            <p>
              Risuko can connect to peer-to-peer networks, tracker lists, media
              sites, and other third-party services. These are operated by
              others; their availability, content, and conduct are outside our
              control, and using them is at your own risk.
            </p>
            <p>
              Optional integrations — such as yt-dlp, BitTorrent trackers, or
              any cloud storage you configure — are subject to their own terms.
            </p>
          </>
        ),
      },
      {
        id: "warranty",
        icon: "warning",
        title: "No Warranty",
        summary: "Risuko is provided “as is”, with no warranties of any kind.",
        body: (
          <p>
            To the fullest extent permitted by law, the Software is provided{" "}
            <strong>without warranty of any kind</strong>, express or implied,
            including merchantability, fitness for a particular purpose, and
            non-infringement. We do not warrant that it will be uninterrupted,
            error-free, or that any download will complete successfully.
          </p>
        ),
      },
      {
        id: "liability",
        icon: "ban",
        title: "Limitation of Liability",
        summary:
          "We're not liable for damages arising from your use of Risuko, as far as the law allows.",
        body: (
          <p>
            To the fullest extent permitted by law, the authors and contributors
            of Risuko will not be liable for any indirect, incidental, special,
            or consequential damages, or for any loss of data, arising out of or
            related to your use of — or inability to use — the Software.
          </p>
        ),
      },
      {
        id: "changes",
        icon: "refresh",
        title: "Changes to the App & Terms",
        summary:
          "Risuko evolves, and these terms may too. Continued use means you accept the current version.",
        body: (
          <p>
            We may update the Software and these terms from time to time.
            Material changes are reflected by the “last updated” date above.
            Your continued use after a change takes effect means you accept the
            revised terms.
          </p>
        ),
      },
      {
        id: "termination",
        icon: "x",
        title: "Termination",
        summary:
          "You can stop using Risuko whenever you like; these terms end when you do.",
        body: (
          <p>
            You may stop using Risuko and uninstall it at any time. The
            disclaimers and liability limits above survive termination.
          </p>
        ),
      },
      {
        id: "contact",
        icon: "mail",
        title: "Contact",
        summary: "Questions about these terms? Reach the project on GitHub.",
        body: (
          <p>
            Questions about these terms can be raised on the project's{" "}
            {gh("GitHub repository")}.
          </p>
        ),
      },
    ],
  },

  "zh-CN": {
    title: "服务条款",
    updated: "2026年7月4日",
    intro:
      "Risuko 是一款免费开源工具。本条款旨在明确双方的预期——你可以做什么，以及我们无法承诺什么。",
    sections: [
      {
        id: "acceptance",
        icon: "scale",
        title: "接受条款",
        summary: "安装或使用 Risuko 即表示你同意本条款。若不同意，请勿使用。",
        body: (
          <>
            <p>
              本服务条款适用于你对 <strong>Risuko</strong>
              （一款开源下载管理器，包括其桌面应用、命令行工具及相关组件，统称
              <strong>“本软件”</strong>）的使用。
            </p>
            <p>
              下载、安装或使用本软件，即表示你同意受本条款约束。若你代表某组织使用
              Risuko，则视为你代表该组织同意本条款。
            </p>
          </>
        ),
      },
      {
        id: "license",
        icon: "file-check",
        title: "使用许可",
        summary:
          "Risuko 是开源软件。你可在其许可证下自由使用、研究、修改和分享。",
        body: (
          <>
            <p>
              本软件依据其开源许可证发布（详见项目仓库中的 <code>LICENSE</code>{" "}
              文件）。该许可证——而非本页面——规定了你对源代码的权利。本条款涵盖你对所分发的应用及服务的使用。
            </p>
            <p>
              Risuko
              的名称、标识和品牌形象仍归其作者所有，开源许可证并未授予你相关权利。
            </p>
          </>
        ),
      },
      {
        id: "acceptable-use",
        icon: "shield",
        title: "可接受的使用",
        summary:
          "Risuko 是中立工具。你需自行对下载内容负责，并遵守版权与法律。",
        body: (
          <>
            <p>
              Risuko 不托管、提供或控制任何内容，仅从<strong>你</strong>
              选择的来源传输数据。你需自行确保有权下载、存储、分享，以及在点对点协议下重新分发（做种）你通过本软件传输的任何文件。
            </p>
            <p>
              请勿使用 Risuko
              侵犯版权、传播恶意软件或违反任何适用法律。我们通常无法也不会监控你的下载内容。
            </p>
          </>
        ),
      },
      {
        id: "accounts",
        icon: "user",
        title: "账户与托管服务",
        summary:
          "云同步和文件分享需要账户并运行在我们的服务器上。请妥善保管登录凭据并合法使用。",
        body: (
          <>
            <p>
              部分可选功能——云同步和文件分享——需要账户并使用我们的托管后端。你需对账户下的活动负责，并妥善保管登录凭据。
            </p>
            <p>
              请勿利用分享或同步存储或传播违法内容。对于违反本条款或法律的行为，我们可暂停账户或删除相关数据。这些托管服务按“尽力而为”的原则提供，可能变更或停止。
            </p>
          </>
        ),
      },
      {
        id: "third-party",
        icon: "server",
        title: "第三方内容与来源",
        summary:
          "你连接的链接、Tracker、插件和服务器均属第三方，我们不加以控制或背书。",
        body: (
          <>
            <p>
              Risuko 可连接到点对点网络、Tracker
              列表、媒体站点及其他第三方服务。这些由他人运营，其可用性、内容和行为不受我们控制，使用风险由你自负。
            </p>
            <p>
              可选集成——例如 yt-dlp、BitTorrent Tracker
              或你配置的任何云存储——须遵守其各自的条款。
            </p>
          </>
        ),
      },
      {
        id: "warranty",
        icon: "warning",
        title: "不提供担保",
        summary: "本软件按“现状”提供，不附带任何形式的担保。",
        body: (
          <p>
            在法律允许的最大范围内，本软件按
            <strong>“现状”提供，不附带任何明示或默示的担保</strong>
            ，包括适销性、特定用途适用性及不侵权。我们不保证其不中断、无错误，也不保证任何下载能够成功完成。
          </p>
        ),
      },
      {
        id: "liability",
        icon: "ban",
        title: "责任限制",
        summary:
          "在法律允许的范围内，我们不对因你使用 Risuko 而产生的损害负责。",
        body: (
          <p>
            在法律允许的最大范围内，对于因你使用或无法使用本软件而引起的任何间接、附带、特殊或后果性损害，或任何数据丢失，Risuko
            的作者及贡献者概不负责。
          </p>
        ),
      },
      {
        id: "changes",
        icon: "refresh",
        title: "应用与条款的变更",
        summary:
          "Risuko 会不断演进，本条款也可能随之更新。继续使用即表示接受当前版本。",
        body: (
          <p>
            我们可能不时更新本软件及本条款。重大变更将通过上方的“最后更新”日期体现。变更生效后你继续使用，即表示接受修订后的条款。
          </p>
        ),
      },
      {
        id: "termination",
        icon: "x",
        title: "终止",
        summary: "你可随时停止使用 Risuko；届时本条款即告终止。",
        body: (
          <p>
            你可随时停止使用并卸载
            Risuko。上述免责声明与责任限制在终止后仍然有效。
          </p>
        ),
      },
      {
        id: "contact",
        icon: "mail",
        title: "联系方式",
        summary: "对本条款有疑问？请在 GitHub 上联系项目。",
        body: <p>有关本条款的问题可在项目的 {gh("GitHub 仓库")} 提出。</p>,
      },
    ],
  },

  "zh-TW": {
    title: "服務條款",
    updated: "2026年7月4日",
    intro:
      "Risuko 是一款免費開源工具。本條款旨在明確雙方的預期——你可以做什麼，以及我們無法承諾什麼。",
    sections: [
      {
        id: "acceptance",
        icon: "scale",
        title: "接受條款",
        summary: "安裝或使用 Risuko 即表示你同意本條款。若不同意，請勿使用。",
        body: (
          <>
            <p>
              本服務條款適用於你對 <strong>Risuko</strong>
              （一款開源下載管理器，包括其桌面應用程式、命令列工具及相關元件，統稱
              <strong>「本軟體」</strong>）的使用。
            </p>
            <p>
              下載、安裝或使用本軟體，即表示你同意受本條款約束。若你代表某組織使用
              Risuko，則視為你代表該組織同意本條款。
            </p>
          </>
        ),
      },
      {
        id: "license",
        icon: "file-check",
        title: "使用授權",
        summary:
          "Risuko 是開源軟體。你可在其授權條款下自由使用、研究、修改與分享。",
        body: (
          <>
            <p>
              本軟體依據其開源授權條款發布（詳見專案儲存庫中的{" "}
              <code>LICENSE</code>{" "}
              檔案）。該授權——而非本頁面——規範了你對原始碼的權利。本條款涵蓋你對所發布的應用程式及服務的使用。
            </p>
            <p>
              Risuko
              的名稱、標誌與品牌形象仍歸其作者所有，開源授權並未授予你相關權利。
            </p>
          </>
        ),
      },
      {
        id: "acceptable-use",
        icon: "shield",
        title: "可接受的使用",
        summary:
          "Risuko 是中立工具。你需自行對下載內容負責，並遵守著作權與法律。",
        body: (
          <>
            <p>
              Risuko 不託管、提供或控制任何內容，僅從<strong>你</strong>
              選擇的來源傳輸資料。你需自行確保有權下載、儲存、分享，以及在點對點協定下重新散布（做種）你透過本軟體傳輸的任何檔案。
            </p>
            <p>
              請勿使用 Risuko
              侵犯著作權、散布惡意軟體或違反任何適用法律。我們通常無法也不會監控你的下載內容。
            </p>
          </>
        ),
      },
      {
        id: "accounts",
        icon: "user",
        title: "帳戶與託管服務",
        summary:
          "雲端同步與檔案分享需要帳戶並運行在我們的伺服器上。請妥善保管登入憑證並合法使用。",
        body: (
          <>
            <p>
              部分選用功能——雲端同步與檔案分享——需要帳戶並使用我們的託管後端。你需對帳戶下的活動負責，並妥善保管登入憑證。
            </p>
            <p>
              請勿利用分享或同步儲存或散布違法內容。對於違反本條款或法律的行為，我們可暫停帳戶或刪除相關資料。這些託管服務以「盡力而為」的原則提供，可能變更或停止。
            </p>
          </>
        ),
      },
      {
        id: "third-party",
        icon: "server",
        title: "第三方內容與來源",
        summary:
          "你連接的連結、Tracker、外掛與伺服器皆屬第三方，我們不加以控制或背書。",
        body: (
          <>
            <p>
              Risuko 可連接到點對點網路、Tracker
              清單、媒體網站及其他第三方服務。這些由他人營運，其可用性、內容與行為不受我們控制，使用風險由你自負。
            </p>
            <p>
              選用整合——例如 yt-dlp、BitTorrent Tracker
              或你設定的任何雲端儲存——須遵守其各自的條款。
            </p>
          </>
        ),
      },
      {
        id: "warranty",
        icon: "warning",
        title: "不提供擔保",
        summary: "本軟體按「現狀」提供，不附帶任何形式的擔保。",
        body: (
          <p>
            在法律允許的最大範圍內，本軟體按
            <strong>「現狀」提供，不附帶任何明示或默示的擔保</strong>
            ，包括可銷售性、特定用途適用性及不侵權。我們不保證其不中斷、無錯誤，也不保證任何下載能夠成功完成。
          </p>
        ),
      },
      {
        id: "liability",
        icon: "ban",
        title: "責任限制",
        summary:
          "在法律允許的範圍內，我們不對因你使用 Risuko 而產生的損害負責。",
        body: (
          <p>
            在法律允許的最大範圍內，對於因你使用或無法使用本軟體而引起的任何間接、附帶、特殊或衍生性損害，或任何資料遺失，Risuko
            的作者及貢獻者概不負責。
          </p>
        ),
      },
      {
        id: "changes",
        icon: "refresh",
        title: "應用與條款的變更",
        summary:
          "Risuko 會不斷演進，本條款也可能隨之更新。繼續使用即表示接受目前版本。",
        body: (
          <p>
            我們可能不時更新本軟體及本條款。重大變更將透過上方的「最後更新」日期體現。變更生效後你繼續使用，即表示接受修訂後的條款。
          </p>
        ),
      },
      {
        id: "termination",
        icon: "x",
        title: "終止",
        summary: "你可隨時停止使用 Risuko；屆時本條款即告終止。",
        body: (
          <p>
            你可隨時停止使用並解除安裝
            Risuko。上述免責聲明與責任限制在終止後仍然有效。
          </p>
        ),
      },
      {
        id: "contact",
        icon: "mail",
        title: "聯絡方式",
        summary: "對本條款有疑問？請在 GitHub 上聯絡專案。",
        body: <p>有關本條款的問題可在專案的 {gh("GitHub 儲存庫")} 提出。</p>,
      },
    ],
  },
};
