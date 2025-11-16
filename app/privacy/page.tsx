import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/10 to-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">隐私政策</h1>

          <div className="prose prose-gray max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-gray-800 font-semibold">
                🔒 我们高度重视您的隐私保护，本政策详细说明我们如何收集、使用、存储和保护您的个人信息。
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 信息收集范围</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.1 主动收集的信息</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                当您使用本平台的测评服务时，我们可能收集以下信息：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>账号信息</strong>：如您选择注册，我们可能收集邮箱地址、用户名等基本信息</li>
                <li><strong>测评数据</strong>：您在测评过程中的答题结果、得分、完成时间等</li>
                <li><strong>联系方式</strong>：如您主动提供的反馈邮箱或联系方式</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2 自动收集的信息</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>设备信息</strong>：浏览器类型、操作系统、IP地址、访问时间</li>
                <li><strong>使用数据</strong>：页面访问记录、点击行为、停留时长（仅用于统计分析）</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.3 匿名测评与统计数据</h3>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700 leading-relaxed mb-3">
                  ✅ 您可以选择<strong>匿名作答</strong>，此时我们不会收集任何可识别您个人身份的信息，测评结果仅保存在您的设备本地（localStorage）。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  📊 为了改进测评服务和提供百分位排名功能，当您填写基本信息（性别、年龄）后，我们会收集以下<strong>匿名化统计数据</strong>：
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2 ml-4">
                  <li>性别、年龄</li>
                  <li>测评得分、等级</li>
                  <li>维度得分（如适用）</li>
                  <li>完成时间</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  ⚠️ <strong>我们不会收集您的具体答题内容</strong>，仅收集最终得分和基本人口统计学信息，且无法关联到您的个人身份。
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 信息使用方式</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                我们收集的信息将用于以下目的：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>✅ 提供测评服务，生成个性化报告</li>
                <li>✅ 改进量表算法和用户体验</li>
                <li>✅ 进行匿名化统计分析（如百分位排名计算）</li>
                <li>✅ 发送服务通知或重要更新（仅在您主动订阅时）</li>
                <li>✅ 预防欺诈、滥用或违法行为</li>
              </ul>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
                <p className="text-gray-800 font-semibold mb-2">❌ 我们承诺：</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>不会出售、出租或泄露您的个人数据给任何第三方</li>
                  <li>不会将测评结果用于商业推广或精准广告</li>
                  <li>不会在未经授权的情况下公开您的测评记录</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 信息存储与保护</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 本地存储优先</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                为最大程度保护您的隐私，<strong>所有测评数据优先存储在您的设备本地</strong>（浏览器 localStorage），不会自动上传到服务器。
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 数据加密</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>传输过程使用 HTTPS 加密协议</li>
                <li>敏感数据采用加密存储（如涉及服务器存储时）</li>
                <li>访问权限严格控制，仅授权人员可查阅</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 数据保留期限</h3>
              <p className="text-gray-700 leading-relaxed">
                本地数据由您自主控制，可随时清除浏览器缓存删除。如涉及服务器存储（如注册账号时），我们将保留您的数据直到您申请删除或账号注销。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies 使用说明</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                我们可能使用 Cookies 技术来改善用户体验，例如：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>记住您的登录状态</li>
                <li>保存测评进度，避免数据丢失</li>
                <li>统计网站访问量和用户行为（匿名）</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                您可以通过浏览器设置禁用 Cookies，但这可能影响部分功能的正常使用。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 第三方服务</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                在提供服务过程中，我们可能使用以下第三方服务（如适用）：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>云服务提供商</strong>：用于数据存储和服务器托管</li>
                <li><strong>支付平台</strong>：用于处理付费测评订单（如涉及）</li>
                <li><strong>统计分析工具</strong>：用于匿名访问数据分析（如 Google Analytics）</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                这些第三方服务提供商需遵守严格的隐私协议，我们会要求其采取适当的保护措施。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. 未成年人保护</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-gray-700 leading-relaxed mb-3">
                  本平台不针对未满 18 岁用户推广性、心理或行为类敏感测评。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  如您未满 18 周岁，请在监护人的指导下使用本平台。我们不会在明知的情况下收集未成年人的敏感个人信息。若发现相关情况，我们将立即删除相关数据。
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 您的权利</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                根据相关法律法规，您享有以下权利：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>访问权</strong>：查询您的个人数据和测评记录</li>
                <li><strong>更正权</strong>：要求修改不准确或不完整的信息</li>
                <li><strong>删除权</strong>：要求删除您的个人数据或测评记录</li>
                <li><strong>撤回授权</strong>：撤回您之前授予的数据使用同意</li>
                <li><strong>投诉举报</strong>：对隐私政策或数据处理方式提出异议</li>
                <li><strong>账号注销</strong>：随时申请注销账号并删除关联数据</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                如需行使上述权利，请通过本页底部的联系方式与我们联系。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. 政策更新</h2>
              <p className="text-gray-700 leading-relaxed">
                我们可能不时更新本隐私政策，以反映法律要求变化或服务调整。重大变更时，我们会在平台显著位置发布通知。建议您定期查阅本政策以了解最新信息。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. 联系我们</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                如您对本隐私政策有任何疑问、意见或投诉，或希望行使您的隐私权利，请通过以下方式联系我们：
              </p>
              <ul className="list-none text-gray-700 space-y-2">
                <li>📧 <strong>电子邮件</strong>: knowyourself_ofc@163.com</li>
           
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                我们将在收到您的请求后 15 个工作日内予以回复。
              </p>
            </section>

            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-sm text-gray-600">
                本政策最后更新时间：2025年11月
              </p>
              <p className="text-sm text-gray-600 mt-2">
                © 2025 心理量表测评平台 版权所有
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
            >
              返回首页
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
