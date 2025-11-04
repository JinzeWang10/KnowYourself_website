import Link from 'next/link';
import Header from '@/components/Header';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/10 to-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">免责声明</h1>

          <div className="prose prose-gray max-w-none">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-gray-800 font-semibold">
                ⚠️ 请务必仔细阅读本声明，使用本平台即表示您已充分理解并同意以下内容。
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 非医疗性质声明</h2>
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">⚕️ 本平台不提供医疗诊断或治疗服务</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>本平台非医疗机构</strong>，所有测评结果不具备临床诊断效力</li>
                  <li>测评内容仅供<strong>自我了解与学习参考</strong>，不构成医疗、心理或精神健康诊断与治疗建议</li>
                  <li>测评结果<strong>不能替代</strong>专业心理咨询师、临床心理学家或精神科医生的专业评估</li>
                  <li>若您存在<strong>严重情绪困扰、焦虑、抑郁或行为成瘾</strong>问题，必须寻求专业医疗机构或心理健康服务机构的帮助</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 测评结果的局限性</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 准确性限制</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                心理测评是一种辅助工具，其结果受多种因素影响：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>作答时的情绪状态、疲劳程度、环境干扰</li>
                <li>对题目的理解差异或语言文化背景</li>
                <li>自我认知的偏差（如过度自责或自我美化）</li>
                <li>量表本身的标准化样本与您的实际情况差异</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                因此，<strong>我们不保证测评结果的绝对准确性、完整性或适用性</strong>。
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 时效性限制</h3>
              <p className="text-gray-700 leading-relaxed">
                心理状态具有动态变化性，测评结果仅反映您作答时的状态，<strong>不代表长期或未来的状况</strong>。建议定期重新测评以跟踪变化趋势。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 责任限制</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 结果解读责任</h3>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="text-gray-700 leading-relaxed mb-3">
                  用户应<strong>理性看待测评结果</strong>，不应将其作为重大人生决策（如职业选择、婚姻判断、医疗决策等）的唯一依据。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  因测评结果引发的以下后果，<strong>本平台不承担任何法律责任</strong>：
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                  <li>对结果的误解、过度解读或焦虑情绪</li>
                  <li>基于结果做出的错误决策或行为</li>
                  <li>人际关系冲突或自我认知偏差</li>
                  <li>延误专业医疗诊治导致的健康损害</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 技术风险免责</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                因以下原因导致的服务中断、数据丢失或其他损失，本平台不承担责任：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>不可抗力事件（如自然灾害、战争、政府行为）</li>
                <li>网络故障、服务器维护或系统升级</li>
                <li>第三方攻击（如黑客入侵、病毒传播）</li>
                <li>用户设备或网络环境问题</li>
                <li>用户自行清除浏览器缓存导致的本地数据丢失</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.3 第三方内容免责</h3>
              <p className="text-gray-700 leading-relaxed">
                本平台可能包含第三方网站链接或引用外部研究文献。<strong>我们对第三方内容的准确性、合法性或安全性不承担责任</strong>。用户访问第三方网站时应自行判断风险。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 危机干预声明</h2>
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <h3 className="text-lg font-bold text-red-900 mb-3">🆘 紧急情况处理</h3>
                <p className="text-red-800 leading-relaxed mb-4">
                  如果您目前正在经历以下情况，<strong>请立即停止测评并寻求专业帮助</strong>：
                </p>
                <ul className="list-disc list-inside text-red-800 space-y-2 mb-4">
                  <li>严重的抑郁、焦虑或恐慌发作</li>
                  <li>自伤、自杀想法或计划</li>
                  <li>精神病性症状（如幻觉、妄想）</li>
                  <li>物质滥用或成瘾危机</li>
                </ul>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-900 font-semibold mb-2">紧急心理援助资源：</p>
                  <ul className="list-none text-gray-800 space-y-2">
                    <li>🇨🇳 <strong>全国心理援助热线</strong>: 400-161-9995</li>
                    <li>🇭🇰 <strong>香港撒玛利亚防止自杀会</strong>: 2389-2222</li>
                    <li>🌏 <strong>国际心理援助</strong>: <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">findahelpline.com</a></li>
                    <li>🚨 <strong>紧急情况</strong>: 请拨打 120（急救）或 110（报警）</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 知识产权声明</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                本平台使用的量表来源包括：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>公开发表的学术量表</strong>：已标注原始文献出处</li>
                <li><strong>自主开发的评估工具</strong>：版权归本平台所有</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                未经授权，用户<strong>不得复制、传播、修改或商业化使用</strong>平台内容。如涉及版权争议，请及时联系我们。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. 适用人群限制</h2>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed mb-3">
                  本平台<strong>不适合以下人群</strong>使用（除非在专业人士指导下）：
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>未满 18 周岁的未成年人（需监护人陪同）</li>
                  <li>正在接受精神疾病治疗的患者</li>
                  <li>处于急性心理危机状态的个体</li>
                  <li>认知功能严重受损者（如痴呆症患者）</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 法律适用与管辖</h2>
              <p className="text-gray-700 leading-relaxed">
                本免责声明适用中华人民共和国法律。因本声明产生的任何争议，由本平台所在地人民法院管辖。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. 联系我们</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                如您对本免责声明有任何疑问，请通过以下方式联系我们：
              </p>
              <ul className="list-none text-gray-700 space-y-2">
                <li>📧 <strong>电子邮件</strong>: support@yourdomain.com</li>
                <li>📍 <strong>联系地址</strong>: （待填写注册公司或运营主体地址）</li>
              </ul>
            </section>

            <div className="bg-gray-900 text-white p-6 rounded-lg text-center">
              <p className="font-semibold mb-2">
                重要提示：使用本平台即表示您已完全理解并同意本免责声明
              </p>
              <p className="text-sm text-gray-300">
                本声明最后更新时间：2025年1月
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
    </div>
  );
}
