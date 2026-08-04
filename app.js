// Interactive features for the Notion Website Prototype

document.addEventListener("DOMContentLoaded", () => {
  // 1. Text Copy functionality (for pledge templates)
  const copyButtons = document.querySelectorAll(".copy-btn");
  copyButtons.forEach(button => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const targetTextElement = document.getElementById(targetId);
      
      if (targetTextElement) {
        // Extract inner text (clean list items)
        let textToCopy = "";
        const listItems = targetTextElement.querySelectorAll("li");
        if (listItems.length > 0) {
          listItems.forEach((item, index) => {
            textToCopy += `${index + 1}. ${item.innerText.trim()}\n`;
          });
        } else {
          textToCopy = targetTextElement.innerText.trim();
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = button.innerText;
          button.innerText = "✓ 복사 완료";
          button.style.backgroundColor = "#e1effe";
          button.style.color = "#1e429f";
          button.style.borderColor = "#bae6fd";
          
          showToast("클립보드에 약속문이 복사되었습니다.");

          setTimeout(() => {
            button.innerText = originalText;
            button.style.backgroundColor = "#ffffff";
            button.style.color = "";
            button.style.borderColor = "";
          }, 2000);
        }).catch(err => {
          console.error("복사에 실패했습니다: ", err);
          showToast("복사 중 오류가 발생했습니다.", "error");
        });
      }
    });
  });

  // 2. Interactive Checklist Progress Tracker (in culture.html)
  const checklist = document.querySelectorAll('.interactive-check-item input[type="checkbox"]');
  if (checklist.length > 0) {
    // Add progress bar element dynamically if container exists
    const container = document.querySelector('.checklist-container');
    if (container) {
      const progressWrapper = document.createElement('div');
      progressWrapper.style.margin = '20px 0';
      progressWrapper.style.padding = '12px 16px';
      progressWrapper.style.backgroundColor = '#fafaf9';
      progressWrapper.style.borderRadius = '4px';
      progressWrapper.style.border = '1px solid #e9e9e7';

      const progressLabel = document.createElement('div');
      progressLabel.style.display = 'flex';
      progressLabel.style.justifyContent = 'space-between';
      progressLabel.style.fontSize = '0.9rem';
      progressLabel.style.fontWeight = '700';
      progressLabel.style.marginBottom = '8px';
      progressLabel.innerHTML = `<span>공동체 안전 진도율</span> <span class="progress-percent">0%</span>`;

      const progressBarBg = document.createElement('div');
      progressBarBg.style.height = '8px';
      progressBarBg.style.backgroundColor = '#e5e7eb';
      progressBarBg.style.borderRadius = '4px';
      progressBarBg.style.overflow = 'hidden';

      const progressBarFill = document.createElement('div');
      progressBarFill.className = 'progress-fill';
      progressBarFill.style.height = '100%';
      progressBarFill.style.width = '0%';
      progressBarFill.style.backgroundColor = '#3b82f6';
      progressBarFill.style.transition = 'width 0.3s ease';

      progressBarBg.appendChild(progressBarFill);
      progressWrapper.appendChild(progressLabel);
      progressWrapper.appendChild(progressBarBg);
      container.insertBefore(progressWrapper, container.firstChild);

      const updateProgress = () => {
        const checkedCount = document.querySelectorAll('.interactive-check-item input[type="checkbox"]:checked').length;
        const totalCount = checklist.length;
        const percent = Math.round((checkedCount / totalCount) * 100);
        
        container.querySelector('.progress-percent').innerText = `${percent}%`;
        container.querySelector('.progress-fill').style.width = `${percent}%`;
        
        if (percent === 100) {
          container.querySelector('.progress-fill').style.backgroundColor = '#10b981'; // Green at 100%
          showToast("🎉 축하합니다! 우리 공동체가 안전 지표를 모두 충족했습니다.");
        } else {
          container.querySelector('.progress-fill').style.backgroundColor = '#3b82f6';
        }
      };

      checklist.forEach(checkbox => {
        checkbox.addEventListener('change', updateProgress);
      });

      // Initial check
      updateProgress();
    }
  }

  // 3. Simple Form Submission simulator (join.html)
  const joinForms = document.querySelectorAll('form');
  joinForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      
      submitBtn.disabled = true;
      submitBtn.innerText = "전송 중...";
      
      setTimeout(() => {
        showToast("📧 신청서가 성공적으로 발송되었습니다!");
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
        
        // If there is progress fill in checklist, update it
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
          document.querySelectorAll('.interactive-check-item input[type="checkbox"]').forEach(c => c.checked = false);
          document.querySelector('.progress-percent').innerText = '0%';
          progressFill.style.width = '0%';
          progressFill.style.backgroundColor = '#3b82f6';
        }
      }, 1500);
    });
  });
});

// Toast notification function
function showToast(message, type = "success") {
  // Check if toast container exists, if not create
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '30px';
  toast.style.color = '#ffffff';
  toast.style.fontWeight = '600';
  toast.style.fontSize = '0.92rem';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
  toast.style.animation = 'slideUp 0.3s ease-out';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '8px';
  
  if (type === "success") {
    toast.style.backgroundColor = '#1f2937';
  } else {
    toast.style.backgroundColor = '#ef4444';
  }
  
  toast.innerText = message;
  container.appendChild(toast);

  // Keyframes injection for animation
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.innerHTML = `
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.5s ease-out';
    setTimeout(() => {
      toast.remove();
    }, 480);
  }, 3000);
}
